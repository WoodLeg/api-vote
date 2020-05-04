import { isNull, isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import { Serializer, Error as JSONApiError } from 'jsonapi-serializer';

const UserSerializer = new Serializer('users', { attributes: ['username', 'uuid'] });

export default class UserController {
  static async signin(request, response) {
    let { username, password } = request.body;

    if (isNull(username) || isNull(password) || isUndefined(username) || isUndefined(password)) {
      let err = new JSONApiError({ status: 422, detail: 'Missing parameters' });
      response.status(422).json(err);
      return;
    }

    let user;
    try {
      user = await User.findByUsername(username);
    } catch ({ code, message }) {
      let err;
      if (code === 404) {
        err = new JSONApiError({ status: 401, detail: 'Username or password invalid' });
        response.status(401).json(err);
        return;
      }
      err = new JSONApiError({ status: code, detail: message });
      response.status(code).json(err);
      return;
    }

    let userAuthenticated = user.testPassword(password);

    let bearer = 'Bearer ';
    bearer += jwt.sign({ username: user.getUsername(), uuid: user.getUuid() }, 'dredd');

    if (userAuthenticated) {
      let payload = UserSerializer.serialize(user);
      response.json(payload);
    } else {
      const err = new JSONApiError({ status: 401, detail: 'Wrong username or password' });
      response.status(401).json(err);
    }
  }

  static async signup(request, response) {
    let { username, password } = request.body;

    if (isNull(username) || isNull(password) || isUndefined(username) || isUndefined(username)) {
      let err = new JSONApiError({ status: 422, detail: 'Missing parameters' });
      response.status(422).json(err);
      return;
    }
    let user = new User(username);
    user.addPassword(password);

    try {
      await user.save();
    } catch ({ code, message }) {
      response.status(code).json({ ok: false, error: { message } });
      return;
    }

    let bearer = 'Bearer ';
    bearer += jwt.sign({ username: user.getUsername(), uuid: user.getUuid() }, 'dredd');

    response.status(201).json({ data: { user: { id: user.getId(), uuid: user.getUuid(), username: user.getUsername(), bearer } } });
  }
}
