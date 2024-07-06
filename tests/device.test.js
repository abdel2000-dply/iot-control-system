import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import Device from '../models/Device';

chai.use(chaiHttp);
const { expect } = chai;

describe('Device Management', () => {
  let deviceFindStub,
    deviceSaveStub,
    deviceCreateStub,
    deviceFindOneAndDeleteStub,
    deviceFindOneStub,
    jwtStub;

  beforeEach(() => {
    deviceFindStub = sinon.stub(Device, 'find');
    deviceSaveStub = sinon.stub(Device.prototype, 'save');
    deviceCreateStub = sinon.stub(Device, 'create');
    deviceFindOneAndDeleteStub = sinon.stub(Device, 'findOneAndDelete');
    deviceFindOneStub = sinon.stub(Device, 'findOne');
    jwtStub = sinon
      .stub(jwt, 'verify')
      .callsFake(() => ({ userId: 'testUserId' }));
  });

  afterEach(() => {
    deviceFindStub.restore();
    deviceSaveStub.restore();
    deviceCreateStub.restore();
    deviceFindOneAndDeleteStub.restore();
    deviceFindOneStub.restore();
    jwtStub.restore();
  });

  describe('POST /api/devices', () => {
    it('should register a new device', (done) => {
      deviceCreateStub.resolves({
        _id: 'deviceId',
        userId: 'testUserId',
        deviceName: 'testDevice',
        deviceType: 'sensor',
        isActive: false,
        createdAt: new Date(),
        lastSeen: new Date(),
        status: 'offline',
        settings: {}
      });

      const newDevice = {
        deviceName: 'testDevice',
        deviceType: 'sensor'
      };

      chai
        .request(app)
        .post('/api/devices')
        .set('Authorization', 'Bearer validToken')
        .send(newDevice)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('newDevice').to.have.property('deviceName').eql('testDevice');
          done();
        });
    });
  });

  describe('GET /api/devices/:deviceId', () => {
    it('should get a device by ID', (done) => {
      deviceFindOneStub.resolves({
        _id: 'deviceId',
        userId: 'testUserId',
        deviceName: 'testDevice',
        deviceType: 'sensor',
        isActive: false,
        createdAt: new Date(),
        lastSeen: new Date(),
        status: 'offline',
        settings: {}
      });

      chai
        .request(app)
        .get('/api/devices/deviceId')
        .set('Authorization', 'Bearer validToken')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('deviceName').eql('testDevice');
          done();
        });
    });

    it('should return 404 if the device is not found', (done) => {
      deviceFindOneStub.resolves(null);

      chai
        .request(app)
        .get('/api/devices/deviceId')
        .set('Authorization', 'Bearer validToken')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').eql('Device not found');
          done();
        });
    });
  });

  describe('GET /api/devices', () => {
    it('should list all devices for the user', (done) => {
      deviceFindStub.resolves([
        {
          _id: 'deviceId1',
          userId: 'testUserId',
          deviceName: 'testDevice1',
          deviceType: 'sensor',
          isActive: false,
          createdAt: new Date(),
          lastSeen: new Date(),
          status: 'offline',
          settings: {}
        },
        {
          _id: 'deviceId2',
          userId: 'testUserId',
          deviceName: 'testDevice2',
          deviceType: 'sensor',
          isActive: true,
          createdAt: new Date(),
          lastSeen: new Date(),
          status: 'online',
          settings: {}
        }
      ]);

      chai
        .request(app)
        .get('/api/devices')
        .set('Authorization', 'Bearer validToken')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.eql(2);
          expect(res.body[0]).to.have.property('deviceName').eql('testDevice1');
          expect(res.body[1]).to.have.property('deviceName').eql('testDevice2');
          done();
        });
    });
  });

  describe('PUT /api/devices/:deviceId/toggle', () => {
    it('should toggle the state of a device', (done) => {
      deviceFindOneStub.resolves({
        _id: 'deviceId',
        userId: 'testUserId',
        deviceName: 'testDevice',
        deviceType: 'sensor',
        isActive: false,
        createdAt: new Date(),
        lastSeen: new Date(),
        status: 'offline',
        settings: {},
        save: sinon.stub().resolvesThis()
      });

      chai
        .request(app)
        .put('/api/devices/deviceId/toggle')
        .set('Authorization', 'Bearer validToken')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('isActive').eql(true);
          done();
        });
    });
  });

  describe('PUT /api/devices/:deviceId', () => {
    it('should update a device by ID', (done) => {
      deviceFindOneStub.resolves({
        _id: 'deviceId',
        userId: 'testUserId',
        deviceName: 'oldDeviceName',
        deviceType: 'sensor',
        isActive: false,
        createdAt: new Date(),
        lastSeen: new Date(),
        status: 'offline',
        settings: {},
        save: sinon.stub().resolvesThis()
      });

      const updatedDevice = {
        deviceName: 'newDeviceName'
      };

      chai
        .request(app)
        .put('/api/devices/deviceId')
        .set('Authorization', 'Bearer validToken')
        .send(updatedDevice)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('deviceName').eql('newDeviceName');
          done();
        });
    });
  });

  describe('DELETE /api/devices/:deviceId', () => {
    it('should delete a device by ID', (done) => {
      deviceFindOneAndDeleteStub.resolves({
        _id: 'deviceId',
        userId: 'testUserId',
        deviceName: 'testDevice',
        deviceType: 'sensor',
        isActive: false,
        createdAt: new Date(),
        lastSeen: new Date(),
        status: 'offline',
        settings: {}
      });

      chai
        .request(app)
        .delete('/api/devices/deviceId')
        .set('Authorization', 'Bearer validToken')
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

  describe('POST /api/devices/:deviceId/command', () => {
    it('should send a command to a device', (done) => {
      deviceFindOneStub.resolves({
        _id: 'deviceId',
        userId: 'testUserId',
        deviceName: 'testDevice',
        deviceType: 'thermostat',
        isActive: false,
        createdAt: new Date(),
        lastSeen: new Date(),
        status: 'offline',
        settings: {},
        save: deviceSaveStub
      });

      const command = {
        temperature: 25
      };

      chai
        .request(app)
        .post('/api/devices/deviceId/command')
        .set('Authorization', 'Bearer validToken')
        .send({ command })
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('settings');
          done();
        });
    });
  });
});
