import Device from '../models/Device';
import { io } from '../server';
import logger from '../utils/logger';

class DeviceController {
  static async newDevice(req, res) {
    // Post - Create a new device
    const { deviceName, deviceType } = req.body;
    const userId = req.user.id;

    if (!deviceName) {
      logger.error('Missing device name');
      return res.status(400).json({ error: 'Missing device name' });
    }
    if (!deviceType) {
      logger.error('Missing device type');
      return res.status(400).json({ error: 'Missing device type' });
    }

    try {
      const newDevice = await Device.create({
        userId,
        deviceName,
        deviceType,
      });
      // token for the device to authenticate with the websocket server
      const token = `${userId}.${newDevice._id}`;
      // use the token to configure the device to connect to the websocket server
      logger.info('Device created successfully with id: ', newDevice._id, ' Device token: ', token);
      return res.status(201).json({ newDevice, token });
    } catch (error) {
      logger.error(`Device creation error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getDeviceById(req, res) {
    // GET - Get a device by ID
    const { deviceId } = req.params;
    const userId = req.user.id;

    try {
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return res.status(404).json({ error: 'Device not found' });
      }

      logger.info('Device found successfully with id: ', deviceId);
      return res.status(200).json(device);
    } catch (error) {
      logger.error(`Error retrieving device: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  static async listAllDevices(req, res) {
    // GET - List all devices of that user
    const userId = req.user.id;
  
    try {
      const devices = await Device.find({ userId });
      if (!devices) {
        logger.error(`No devices found for user: ${userId}`);
        return res.status(404).json({ error: 'No devices found' });
      }

      logger.info(`Devices retrieved successfully for user: ${userId}`);
      return res.status(200).json(devices);
    } catch (error) {
      logger.error(`Error listing devices: ${error.message}`);
      return res.status(500).json({ error: error.message });      
    }
  }

  static async toggleDeviceState(req, res) {
    // PUT - turn a device ON/OFF
    const { deviceId } = req.params;
    const userId = req.user.id;
  
    try {
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return res.status(404).json({ error: 'Device not found' });
      }

      device.isActive = !device.isActive;
      device.lastSeen = Date.now();

      await device.save();

      logger.info(`Device state toggled: ${deviceId}`);
      return res.status(200).json(device);
    } catch (error) {
      logger.error(`Error toggling device state: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }
  
  static async getDeviceStatus(req, res) {
    // GET - Get the status of a device (ON/OFF)
    const { deviceId } = req.params;
    const userId = req.user.id;

    try {
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return res.status(404).json({ error: 'Device not found' });
      }

      const response = {
        isActive: device.isActive,
        status: device.status,
        lastSeen: device.lastSeen,
      };

      logger.info(`Device status retrieved: ${deviceId}`);
      return res.status(200).json(response);
    } catch (error) {
      logger.error(`Error retrieving device status: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateDevice(req, res) {
    // PUT - Update a device by ID
    const { deviceId } = req.params;
    const userId = req.user.id;
    const { deviceName, deviceType, settings } = req.body;

    try {
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return res.status(404).json({ error: 'Device not found' });
      }

      if (deviceName) device.deviceName = deviceName;
      if (deviceType) device.deviceType = deviceType;
      if (settings) device.settings = settings;

      await device.save();

      logger.info(`Device updated: ${deviceId}`);
      return res.status(200).json(device);
    } catch (error) {
      logger.error(`Error updating device: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteDevice(req, res) {
    // DELETE - Delete a device by ID
    const { deviceId } = req.params;
    const userId = req.user.id;

    try {
      const device = await Device.findOneAndDelete({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return res.status(404).json({ error: 'Device not found' });
      }

      logger.info(`Device deleted: ${deviceId}`);
      return res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting device: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }

  static async sendCommand(req, res) {
    // POST - Send a command to a device
    const { deviceId } = req.params;
    const userId = req.user.id;
    const { command } = req.body;

    if (!command) {
      logger.error('Missing command');
      return res.status(400).json({ error: 'Missing command' });
    }

    try {
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return res.status(404).json({ error: 'Device not found' });
      }

      device.settings = { ...device.settings, ...command };
      await device.save();

      // send the command via websockets ...
      io.to(deviceId).emit('command', { command });

      logger.info(`Command sent to device: ${deviceId}`);
      return res.status(200).json(device);
    } catch (error) {
      logger.error(`Error sending command to device: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default DeviceController;
