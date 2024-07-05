import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import deviceRoutes from './routes/device';
import dataRoutes from './routes/devicedata';
import { handleWebSocketConnection } from './websocket';
import swagger from './utils/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/auth/', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/deviceData', dataRoutes); 

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

swagger(app);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', handleWebSocketConnection);

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

export { app, server, io };
