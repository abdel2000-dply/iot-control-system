const io = require('socket.io-client');

const serverUrl = 'http://localhost:5000';

const token = '66881eb2c70843be4a0e75a2.6688845120e50024efb34f61';

// Connect to the Socket.IO server
const socket = io(serverUrl);

socket.on('connect', function () {
  console.log('Connected to the server');

  // Authenticate the device
  socket.emit('authenticate', token);

  // Send fake data periodically
  setInterval(function () {
    const fakeData = {
      temperature: Math.random() * 30 + 10, // Random temperature between 10 and 40
      humidity: Math.random() * 100 // Random humidity between 0 and 100
    };

    socket.emit('deviceData', { deviceData: fakeData });

    console.log('Sent data:', fakeData);
  }, 10000); // Send data every 10 seconds

  // Send fake data once
  // socket.emit('deviceData', {
  //   deviceData: {
  //     temperature: 22,
  //     humidity: 50
  //   }
  // });
});

socket.on('message', function (data) {
  console.log('Received message:', data);
});

socket.on('disconnect', function () {
  console.log('Disconnected from the server');
});

socket.on('connect_error', function (err) {
  console.error('Socket.IO connection error:', err);
});
