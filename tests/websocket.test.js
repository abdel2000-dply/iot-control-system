import { expect } from 'chai';
import io from 'socket.io-client';
import { server } from '../server';
import Device from '../models/Device';
import DeviceData from '../models/DeviceData';
import mongoose from 'mongoose';
import sinon from 'sinon';

describe('WebSocket Server', function () {
  let clientSocket, saveDataStub, findOneStub, saveDeviceStub;

  // before((done) => {
  //   mongoose
  //     .connect(process.env.DB_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //       useCreateIndex: true
  //     })
  //     .then(() => done())
  //     .catch((error) => done(error));
  // });

  beforeEach((done) => {
    clientSocket = io.connect(`http://localhost:${process.env.PORT || 5000}`, {
      reconnectionDelay: 0,
      forceNew: true,
      transports: ['websocket']
    });
    clientSocket.on('connect', () => done());
    clientSocket.on('connect_error', (error) => done(error));
    saveDataStub = sinon.stub(DeviceData.prototype, 'save');
    findOneStub = sinon.stub(Device, 'findOne');
    saveDeviceStub = sinon.stub(Device.prototype, 'save');
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    findOneStub.restore();
    saveDataStub.restore();
    saveDeviceStub.restore();
    done();
  });

  // after((done) => {
  //   mongoose.connection.close(() => {
  //     server.close(() => done());
  //   });
  // });

  describe('Device Authentication', () => {
    it('should authenticate device with valid token', (done) => {
      findOneStub.resolves({
        _id: '60f7f5f49b1e8d3a58f6b2d4',
        userId: '60f7f5e49b1e8d3a58f6b2d3',
        lastSeen: new Date(),
        status: 'offline',
        save: saveDeviceStub
      });

      clientSocket.emit('authenticate', {
        token: 'validToken',
      });

      clientSocket.on('authenticated', (message) => {
        expect(message).to.equal('Authenticated successfully');
        done();
      });
    });
  });

  describe('Device Data', () => {
    it('should acknowledge received data from device', (done) => {
      sinon.stub(Device, 'findOne').resolves({
        _id: '60f7f5f49b1e8d3a58f6b2d4',
        userId: '60f7f5e49b1e8d3a58f6b2d3',
        lastSeen: new Date(),
        status: 'offline',
        save: saveDeviceStub
      });

      clientSocket.emit('deviceData', {
        deviceData: { temperature: 22 }
      });

      clientSocket.on('ack', (message) => {
        expect(message).to.equal('Data received');
        done();
      });
    });

    it('should send error if device not found', (done) => {
      findOneStub.resolves(null);

      clientSocket.emit('deviceData', {
        deviceData: { temperature: 22 }
      });

      clientSocket.on('deviceError', (message) => {
        expect(message.error).to.equal('Device not found');
        done();
      });
    });
  });
});
