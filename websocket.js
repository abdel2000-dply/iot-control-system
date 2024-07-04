import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Device from './models/Device';
import DeviceData from './models/DeviceData';
import logger from './utils/logger';

dotenv.config();

const handleWebSocketConnection = (socket) => {
  logger.info(`New connection: ${socket.id}`);

  socket.on('authenticate', async (token) => {
    try {
      const { userId, deviceId } = validateToken(token);
      if (!userId || !deviceId) {
        logger.error('Invalid token');
        return socket.emit('authError', { error: 'Invalid token' });
      }

      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return socket.emit('authError', { error: 'Device not found' });
      }

      // save the deviceid and userId in the socket for future use
      socket.deviceId = deviceId;
      socket.userId = userId;

      // save the socket id in the device ???

      socket.emit('authenticated', { message: 'Authenticated successfully' });
      logger.info(`Device authenticated: ${deviceId}`);
    } catch (error) {
      logger.error(`Error authenticating device: ${error.message}`);
      socket.emit('authError', { error: error.message });
    }
  });

  socket.on('deviceData', async (data) => {
    try {
      const { deviceId, userId } = socket;
      if (!deviceId || !userId) {
        logger.error('Device not authenticated');
        return socket.emit('deviceError', { error: 'Device not authenticated' });
      }

      const { deviceData } = data;

      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        logger.error(`Device not found: ${deviceId}`);
        return socket.emit('deviceError', { error: 'Device not found' });
      }

      // Check if the device is active
      // if (!device.isActive) {
      //   logger.error(`Device is not active: ${deviceId}`);
      //   return socket.emit('deviceError', { error: 'Device is not active' });
      // }

      device.lastSeen = Date.now();
      device.status = 'online';

      // handle the recived data
      const newData = new DeviceData({
        deviceId,
        userId,
        data: deviceData,
      });

      logger.info(`Data received: ${JSON.stringify(deviceData)}`);

      await device.save();
      await newData.save();

      logger.info(`Data received from device: ${deviceId}`)
      socket.emit('ack', 'Data received');
    } catch (error) {
      logger.error(`Error receiving data: ${error.message}`);
      socket.emit('deviceError', { error: error.message });
    }
  });
};

function validateToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId, deviceId: decoded.deviceId };
  } catch (error) {
    return null;
  }
}

export { handleWebSocketConnection };
