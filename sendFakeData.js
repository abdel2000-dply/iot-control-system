const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Replace these with appropriate values
const serverUrl = 'http://localhost:5000';

// JWT token got from registering a new device
// const token =
//   'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njg4MWViMmM3MDg0M2JlNGEwZTc1YTIiLCJkZXZpY2VJZCI6IjY2ODgxZjdjYzcwODQzYmU0YTBlNzVhNyIsImlhdCI6MTcyMDE5Njk4OH0.CnhToX6XXdKKMtn35L6zKyHkFGjGLuNSVEmaBqEi174';

const userId = '66881eb2c70843be4a0e75a2';
const deviceId = '66881f31c70843be4a0e75a5';

const token = jwt.sign({ userId, deviceId }, process.env.JWT_SECRET);

// Connect to the Socket.IO server
const socket = io(serverUrl);

socket.on('connect', function () {
  console.log('Connected to the server');

  // Authenticate the device
  socket.emit('authenticate', { token: `Bearer ${token}` });

  // Send fake data periodically
  // setInterval(function () {
  //   const fakeData = {
  //     temperature: Math.random() * 30 + 10, // Random temperature between 10 and 40
  //     humidity: Math.random() * 100 // Random humidity between 0 and 100
  //   };

  //   socket.emit('deviceData', { deviceData: fakeData });

  //   console.log('Sent data:', fakeData);
  // }, 5000); // Send data every 5 seconds

  // Send fake data once
  socket.emit('deviceData', {
    deviceData: {
      temperature: 22,
      humidity: 50
    }
  });
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
