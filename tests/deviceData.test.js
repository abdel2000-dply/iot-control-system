import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { app } from '../server';
import DeviceData from '../models/DeviceData';

chai.use(chaiHttp);
const { expect } = chai;

describe('DataController', () => {
  let findStub, jwtStub;

  beforeEach(() => {
    findStub = sinon.stub(DeviceData, 'find');
    jwtStub = sinon
      .stub(jwt, 'verify')
      .callsFake(() => ({ userId: 'testUserId' }));
  });

  afterEach(() => {
    findStub.restore();
    jwtStub.restore();
  });

  describe('GET /api/deviceData/:deviceId', () => {
    it('should retrieve device data within the specified time range', (done) => {
      const mockData = [
        { timestamp: new Date(), data: { temperature: 25 } },
        { timestamp: new Date(), data: { temperature: 26 } }
      ];
      findStub.returns({
        sort: sinon.stub().returns(Promise.resolve(mockData))
      });

      chai
        .request(app)
        .get('/api/deviceData/60f7f5f49b1e8d3a58f6b2d4')
        .set('Authorization', 'Bearer validToken')
        .query({
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-01-01T23:59:59.999Z'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          expect(res.body[0].data.temperature).to.equal(25);
          done();
        });
    });

    it('should use default time range when startDate and endDate are not provided', (done) => {
      const mockData = [
        { timestamp: new Date(), data: { temperature: 25 } },
        { timestamp: new Date(), data: { temperature: 26 } }
      ];
      findStub.returns({
        sort: sinon.stub().returns(Promise.resolve(mockData))
      });

      chai
        .request(app)
        .get('/api/deviceData/60f7f5f49b1e8d3a58f6b2d4')
        .set('Authorization', 'Bearer validToken')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });

    
});
