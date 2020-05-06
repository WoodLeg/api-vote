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
      expect(res.body).to.be.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters' }] });
    });

    it('should return 200 with user payload', async () => {
      const res = await requester.post('/users/signin').send({ email: 'michael.scott@dm.com', password: 'qwerty' });

      expect(res).to.have.status(200);
      let payload = res.body;
      expect(payload.data).to.deep.equal({
        type: 'users',
        id: '1',
        attributes: {
          email: 'michael.scott@dm.com',
          uuid: '1111-1111111-1111-11111'
        }
      });
      let bearer = payload.meta.bearer.split(' ');
      expect(bearer[0]).to.be.equal('Bearer');
      expect(bearer[1]).to.match(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);
    });

    it('should returns a 422 if missing password', async () => {
      const res = await requester.post('/users/signin').send({ username: 'Peter' });
      expect(res).to.have.status(422);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters' }] });
    });

    it('should returns a 422 if missing username', async () => {
      const res = await requester.post('/users/signin').send({ password: 'passwordTest' });
      expect(res).to.have.status(422);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters' }] });
    });

    it('should returns 401 if username invalid', async () => {
      const res = await requester.post('/users/signin').send({ email: 'dwight.shrutt@dm.com', password: 'qwerty' });

      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 401, detail: 'Email or password invalid' }] });
    });

    it('should returns 401 if password invalid', async () => {
      const res = await requester.post('/users/signin').send({ email: 'michael.scott@dm.com', password: 'hendrix' });

      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 401, detail: 'Wrong email or password' }] });
    });
  });

  describe('POST /users/signup', () => {
    it('should return 201', async () => {
      const res = await requester.post('/users/signup').send({ email: 'andy.bernard@dm.com', password: 'dunder' });
      expect(res).to.have.status(201);
      let payload = res.body;
      expect(payload.data.attributes.email).to.be.equal('andy.bernard@dm.com');
      expect(payload.data.attributes.uuid).to.match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/);
      let bearer = payload.meta.bearer.split(' ');
      expect(bearer[0]).to.equal('Bearer');
      expect(bearer[1]).to.match(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/);
    });

    it('should return 422 when trying to signup already', async () => {
      const res = await requester.post('/users/signup').send({ email: 'michael.scott@dm.com', password: 'qwerty' });
      expect(res).to.have.status(401);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 401, detail: 'Email already taken' }] });
    });

    it('should return 422 if no data is provided', async () => {
      const res = await requester.post('/users/signup');
      expect(res).to.have.status(422);
      expect(res.body).to.be.deep.equal({ errors: [{ status: 422, detail: 'Missing parameters' }] });
    });
  });
});
