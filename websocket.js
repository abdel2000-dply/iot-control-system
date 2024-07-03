import Device from './models/Device';
import logger from './utils/logger';

const handleWebSocketConnection = (socket) => {
  logger.info(`New connection: ${socket.id}`);

  socket.on('deviceData', async (data) => {
    try {
      const { deviceId, userId, deviceData } = data;
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
      logger.info(`Data received: ${deviceData}`); // for now just log the data

      await device.save();

      logger.info(`Data received from device: ${deviceId}`)
      socket.emit('ack', 'Data received');
    } catch (error) {
      logger.error(`Error receiving data: ${error.message}`);
      socket.emit('deviceError', { error: error.message });
    }
  });
};

export { handleWebSocketConnection };
