import bcrypt from 'bcrypt';
import database from 'db/database';
import { isNull, isUndefined } from 'lodash';
import uuid from 'uuid';

export default class User {
  email = null;
  password = null;
  uuid = null;
  id = null;

  constructor(email, password, options = {}) {
    this.email = email;
    this.password = password || null;
    this.uuid = options.uuid || uuid.v4();
    this.id = options.id || null;
  }

  addPassword(password) {
    let hashPassword = bcrypt.hashSync(password, 10);
    this.password = hashPassword;
    return this;
  }

  testPassword(password) {
    if (isNull(this.password)) {
      return false;
    }
    return bcrypt.compareSync(password, this.password);
  }

  static async findByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        await database.open();
      } catch (error) {
        console.error('Database connection failed: ', error);
        reject({ code: 500, message: 'Une erreur est survenue' });
        return;
      }
      console.log(email);
      let query = `SELECT * from users WHERE email='${email}'`;
      let capsule = {};
      try {
        capsule = await database.get(query);
      } catch (error) {
        await database.close();
        console.error('Database query failed: ', error);
        reject({ code: 500, message: 'A database error occuried.' });
      }
      await database.close();

      if (isUndefined(capsule.data)) {
        reject({ code: 404, message: 'Email not found' });
        return;
      }

      let rawUser = capsule.data;
      let user = new User(rawUser.email, rawUser.password, { id: rawUser.id, uuid: rawUser.uuid });
      resolve(user);
    });
  }

  async save() {
    return new Promise(async (resolve, reject) => {
      try {
        await database.open();
      } catch (error) {
        reject(error);
      }

      let query = `SELECT * from users WHERE email='${this.email}'`;

      let found;
      try {
        found = await database.get(query);
      } catch (error) {
        reject(error);
      }

      if (found.data) {
        reject({ code: 401, message: 'Email already taken' });
      }

      let insertQuery = `INSERT INTO users (email, password, uuid) VALUES ('${this.email}', '${this.password}', '${this.uuid}');`;
      try {
        await database.run(insertQuery);
      } catch (error) {
        reject(error);
      }

      resolve(this);
    });
  }
}
