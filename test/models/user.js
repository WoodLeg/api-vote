import { expect } from 'chai';
import User from '../../src/models/user';

describe('User model', () => {
  let email = 'michael.scott@dm.com';
  let password = 'judge';
  let hashPassword = '$2b$10$BSm./4F3IoiCWBFpLp0JL.cmsTO9XzF7XKZfDyIEZvIT.tJDchN/i';
  let uuid = '1111-11111-1111-11111';
  let id = 1;
  let user = new User(email, password, { uuid, id });

  it('everything is defined properly', () => {
    expect(user.email).to.be.ok;
    expect(user.password).to.be.ok;
    expect(user.id).to.be.ok;
    expect(user.uuid).to.be.ok;
  });

  it('testPassword() should test the given password with the hash one', () => {
    user.addPassword(password);
    expect(user.testPassword(password)).to.be.true;
  });

  describe('findByEmail()', () => {
    it('should return the user', async () => {
      const found = await User.findByEmail('michael.scott@dm.com');
      expect(found).to.have.ownProperty('email');
      expect(found).to.have.ownProperty('password');
      expect(found).to.have.ownProperty('uuid');
      expect(found).to.have.ownProperty('id');
    });

    it('should return a 404 with error payload', async () => {
      try {
        await User.findByEmail('jim.halpert@dm.com');
      } catch (error) {
        expect(error).to.have.ownProperty('code');
        expect(error.code).to.be.equal(404);
        expect(error).to.have.ownProperty('message');
      }
    });
  });

  // Async functions to tests
});
