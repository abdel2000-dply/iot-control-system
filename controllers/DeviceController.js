import Device from '../models/Device';

class DeviceController {
  static async newDevice(req, res) {
    // Post - Create a new device
    const { deviceName, deviceType } = req.body;
    const userId = req.user.id;

    if (!deviceName) {
      return res.status(400).json({ error: 'Missing device name' });
    }
    if (!deviceType) {
      return res.status(400).json({ error: 'Missing device type' });
    }

    try {
      const newDevice = await Device.create({
        userId,
        deviceName,
        deviceType,
      });
      await newDevice.save();

      return res.status(201).json(newDevice);
    } catch (error) {
      console.error(error);
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
        return res.status(404).json({ error: 'Device not found' });
      }

      return res.status(200).json(device);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async listAllDevices(req, res) {
    // GET - List all devices of that user
    const userId = req.user.id;
  
    try {
      const devices = await Device.find({ userId });
      return res.status(200).json(devices);
    } catch (error) {
      console.error(error);
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
        return res.status(404).json({ error: 'Device not found' });
      }

      device.isActive = !device.isActive;
      device.lastSeen = Date.now();

      await device.save();

      return res.status(200).json(device);
    } catch (error) {
      console.error(error);
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
        return res.status(404).json({ error: 'Device not found' });
      }

      const response = {
        isActive: device.isActive,
        status: device.status,
        lastSeen: device.lastSeen,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

}

export default DeviceController;
