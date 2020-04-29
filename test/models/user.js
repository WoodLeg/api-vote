import { expect } from 'chai';
import User from '../../src/models/user';

describe('User model', () => {
  let username = 'Dredd';
  let password = 'judge';
  let hashPassword = '$2b$10$BSm./4F3IoiCWBFpLp0JL.cmsTO9XzF7XKZfDyIEZvIT.tJDchN/i';
  let uuid = '1111-11111-1111-11111';
  let id = 1;
  let user = new User(username, password, { uuid, id });

  it('everything is defined properly', () => {
    expect(user.username).to.be.ok;
    expect(user.password).to.be.ok;
    expect(user.id).to.be.ok;
    expect(user.uuid).to.be.ok;
    expect(user.getId).to.not.be.undefined;
    expect(user.getUuid).to.not.be.undefined;
    expect(user.getUsername).to.not.be.undefined;
  });

  it('getUsername() should return the username', () => {
    expect(user.getUsername()).to.be.equal(username);
  });

  it('getUuid() should return the uuid', () => {
    expect(user.getUuid()).to.be.equal(uuid);
  });

  it('getId() should return the id', () => {
    expect(user.getId()).to.be.equal(id);
  });

  it('testPassword() should test the given password with the hash one', () => {
    user.addPassword(password);
    expect(user.testPassword(password)).to.be.true;
  });

  describe('findByUsername()', () => {
    it('should return the user', async () => {
      const found = await User.findByUsername('Jim');
      expect(found).to.have.ownProperty('username');
      expect(found).to.have.ownProperty('password');
      expect(found).to.have.ownProperty('uuid');
      expect(found).to.have.ownProperty('id');
    });

    it('should return a 404 with error payload', async () => {
      try {
        await User.findByUsername('Jac');
      } catch (error) {
        expect(error).to.have.ownProperty('code');
        expect(error.code).to.be.equal(404);
        expect(error).to.have.ownProperty('message');
      }
    });
  });

  // Async functions to tests
});
