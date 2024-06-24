import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import User from '../models/User';
import app from '../server';

chai.use(chaiHttp);
const { expect } = chai;

describe('Authentication', () => {
  let userFindStub, userSaveStub;

  beforeEach(() => {
    userFindStub = sinon.stub(User, 'findOne');
    userSaveStub = sinon.stub(User.prototype, 'save');
  });

  afterEach(() => {
    userFindStub.restore();
    userSaveStub.restore();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      userFindStub.resolves(null); // findOne returns null
      userSaveStub.resolves({ id: 'testId', email: 'testuser@example.com' }); // save returns the new user
      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/auth/register')
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('email').eql('testuser@example.com');
          done();
        });
    });

    it('should not register an exiting user', (done) => {
      userFindStub.resolves({ id: 'testId', email: 'testuser@example.com' });

      const newUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/auth/register')
        .send(newUser)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.have.property('error').eql('User already exists');
          done();
        });
    });
    // Add more tests later
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', (done) => {
      const password = 'test1234';
      const hashedPassword = bcrypt.hashSync(password, 10);
      const email = 'testuser@example.com';

      userFindStub.resolves({
        id: 'testId',
        email,
        password: hashedPassword,
      });

      chai
        .request(app)
        .post('/api/auth/login')
        .send({ email, password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should not login a user with incorrect credentials', (done) => {
      const password = 'test1234';
      const hashedPassword = bcrypt.hashSync(password, 10);
      const email = 'testuser@example.com';

      userFindStub.resolves({
        id: 'testId',
        email,
        password: 'wrongPassword',
      });

      chai
        .request(app)
        .post('/api/auth/login')
        .send({ email, password })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('Invalid Password');
          done();
        });
    });

    it('should not login a user that does not exist', (done) => {
      const password = 'test1234';
      const email = 'testuser@example.com';
      userFindStub.resolves(null);

      chai
        .request(app)
        .post('/api/auth/login')
        .send({ email, password })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').eql('User not found');
          done();
        });
    });
  });
});
