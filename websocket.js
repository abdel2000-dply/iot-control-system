import Device from './models/Device';
import DeviceData from './models/DeviceData';
import logger from './utils/logger';

const handleWebSocketConnection = (socket) => {
  logger.info(`New connection: ${socket.id}`);

  socket.on('deviceData', async (data) => {
    try {
      const { deviceId, userId, deviceData } = data;
      /*
        - this is send by the device
        - will the decice send the userId?
        - if not, how do we know which user is sending the data?
        - will the device send the deviceId?
        - if not, how do we know which device is sending the data?
      */
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

      logger.info(`Data received from device: ${deviceId}`) // edit the logging message
      socket.emit('ack', 'Data received');
    } catch (error) {
      logger.error(`Error receiving data: ${error.message}`);
      socket.emit('deviceError', { error: error.message });
    }
  });
};

export { handleWebSocketConnection };
