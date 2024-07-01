import { expect } from 'chai';
import io from 'socket.io-client';
import { server } from '../server';
import Device from '../models/Device';
import mongoose from 'mongoose';
import sinon from 'sinon';

describe('WebSocket Server', function () {
  this.timeout(15000); // Increased timeout to 15 seconds

  let clientSocket;

  before((done) => {
    mongoose
      .connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => done())
      .catch((error) => done(error));
  });

  beforeEach((done) => {
    clientSocket = io.connect(`http://localhost:${process.env.PORT || 5000}`, {
      reconnectionDelay: 0,
      forceNew: true,
      transports: ['websocket']
    });
    clientSocket.on('connect', () => done());
    clientSocket.on('connect_error', (error) => done(error));
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  after((done) => {
    mongoose.connection.close(() => {
      server.close(() => done());
    });
  });

  it('should acknowledge received data from device', (done) => {
    sinon.stub(Device, 'findOne').resolves({
      _id: '60f7f5f49b1e8d3a58f6b2d4',
      userId: '60f7f5e49b1e8d3a58f6b2d3',
      lastSeen: new Date(),
      status: 'offline',
      save: async function () {
        /* mock save function */
      }
    });

    clientSocket.emit('deviceData', {
      deviceId: '60f7f5f49b1e8d3a58f6b2d4',
      userId: '60f7f5e49b1e8d3a58f6b2d3',
      deviceData: { temperature: 22 }
    });

    clientSocket.on('ack', (message) => {
      expect(message).to.equal('Data received');
      Device.findOne.restore();
      done();
    });
  });

  it('should send error if device not found', (done) => {
    sinon.stub(Device, 'findOne').resolves(null);

    clientSocket.emit('deviceData', {
      deviceId: 'nonexistentDeviceId',
      userId: 'nonexistentUserId',
      deviceData: { temperature: 22 }
    });

    clientSocket.on('deviceError', (message) => {
      expect(message.error).to.equal('Device not found');
      Device.findOne.restore();
      done();
    });
  });
});
