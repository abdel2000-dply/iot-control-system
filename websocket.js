import Device from './models/Device';

const handleWebSocketConnection = (socket) => {
  console.log('New connection:', socket.id);

  socket.on('deviceData', async (data) => {
    try {
      const { deviceId, userId, deviceData } = data;
      const device = await Device.findOne({ _id: deviceId, userId });
      if (!device) {
        return socket.emit('deviceError', { error: 'Device not found' });
      }

      device.lastSeen = Date.now();
      device.status = 'online';
      // handle the recived data
      console.log('Data received:', deviceData); // for now just log the data
      socket.emit('ack', 'Data received');
    } catch (error) {
      console.error(error);
      socket.emit('deviceError', { error: error.message });
    }
  });
};

export { handleWebSocketConnection };
