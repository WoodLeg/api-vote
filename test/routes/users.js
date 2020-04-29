import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
import app from '../../src/main';
import { expect } from 'chai';

var requester = chai.request(app).keepOpen();

describe('User routes:', () => {
  describe('POST /users/signin', () => {
    it('should return 422 if no username/password provided', async () => {
      const res = await requester.post('/users/signin');
      expect(res).to.have.status(422);
      expect(res.ok).to.be.not.ok;
      expect(res.body).to.be.deep.equal({ error: { message: 'Credentials manquants' } });
    });

    it('should return 200 with user payload', async () => {
      const res = await requester.post('/users/signin').send({ username: 'Jim', password: 'qwerty' });

      expect(res).to.have.status(200);
      let user = res.body.data.user;
      expect(user).to.be.ok;
      expect(user).to.haveOwnProperty('id');
      expect(user).to.haveOwnProperty('username');
      expect(user).to.haveOwnProperty('uuid');
      expect(res.body.data.user).to.haveOwnProperty('bearer');
    });

    it('should returns 401 if username invalid', async () => {
      const res = await requester.post('/users/signin').send({ username: 'Peter', password: 'qwerty' });

      expect(res).to.have.status(401);
    });

    it('should returns 401 if password invalid', async () => {
      const res = await requester.post('/users/signin').send({ username: 'Jim', password: 'hendrix' });

      expect(res).to.have.status(401);
    });
  });

  describe('POST /users/signup', () => {
    it('should return 201', async () => {
      const res = await requester.post('/users/signup').send({ username: 'Janis', password: 'joplin' });
      expect(res).to.have.status(201);
      let { user } = res.body.data;
      expect(user).to.haveOwnProperty('id');
      expect(user).to.haveOwnProperty('uuid');
      expect(user).to.haveOwnProperty('username');
      expect(user).to.haveOwnProperty('bearer');
    });

    it('should return 422 when trying to signup already', async () => {
      const res = await requester.post('/users/signup').send({ username: 'Jim', password: 'qwerty' });
      expect(res).to.have.status(422);
    });

    it('should return 422 if no data is provided', async () => {
      const res = await requester.post('/users/signup');
      expect(res).to.have.status(422);
    });
  });
});
