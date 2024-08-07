import Device from './models/Device';
import DeviceData from './models/DeviceData';
import logger from './utils/logger';

const handleWebSocketConnection = (socket) => {
  logger.info(`New connection: ${socket.id}`);

  socket.on('authenticate', async (token) => {
    try {
      const [userId, deviceId] = token.split('.');
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
      socket.userId = userId;
      socket.deviceId = deviceId;

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
      const { userId, deviceId } = socket;
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

      // Check if the device is active, this will require for the user to activate the device first to receive data
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

      
      await device.save();
      await newData.save();
      
      logger.info(`Data received: ${JSON.stringify(deviceData)} from device: ${deviceId}`);
      socket.emit('ack', 'Data received');
    } catch (error) {
      logger.error(`Error receiving data: ${error.message}`);
      socket.emit('deviceError', { error: error.message });
    }
  });
};


export { handleWebSocketConnection };
