import { isNull, isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';
import User from 'models/user';
import { Serializer, Error as JSONApiError } from 'jsonapi-serializer';

export default class UserController {
  static async signin(request, response) {
    let { email, password } = request.body;

    if (isNull(email) || isNull(password) || isUndefined(email) || isUndefined(password)) {
      let err = new JSONApiError({ status: 422, detail: 'Missing parameters' });
      response.status(422).json(err);
      return;
    }

    let user;
    try {
      user = await User.findByEmail(email);
    } catch ({ code, message }) {
      let err;
      if (code === 404) {
        err = new JSONApiError({ status: 401, detail: 'Email or password invalid' });
        response.status(401).json(err);
        return;
      }
      err = new JSONApiError({ status: code, detail: message });
      response.status(code).json(err);
      return;
    }

    let userAuthenticated = user.testPassword(password);

    let bearer = 'Bearer ';
    bearer += jwt.sign({ email: user.email, uuid: user.uuid }, 'dredd');

    const UserSerializer = new Serializer('user', { id: 'uuid', attributes: ['email', 'uuid'], meta: { bearer }, pluralizeType: false });

    if (userAuthenticated) {
      let payload = UserSerializer.serialize(user);
      response.json(payload);
    } else {
      const err = new JSONApiError({ status: 401, detail: 'Wrong email or password' });
      response.status(401).json(err);
    }
  }

  static async signup(request, response) {
    let { email, password } = request.body;

    if (isNull(email) || isNull(password) || isUndefined(email) || isUndefined(password)) {
      let err = new JSONApiError({ status: 422, detail: 'Missing parameters' });
      response.status(422).json(err);
      return;
    }
    let user = new User(email);
    user.addPassword(password);

    try {
      await user.save();
    } catch ({ code, message }) {
      let err = new JSONApiError({ status: code, detail: message });
      response.status(code).json(err);
      return;
    }

    let bearer = 'Bearer ';
    bearer += jwt.sign({ email: user.email, uuid: user.uuid }, 'dredd');

    const UserSerializer = new Serializer('user', { id: 'uuid', attributes: ['email', 'uuid'], meta: { bearer }, pluralizeType: false });
    let payload = UserSerializer.serialize(user);

    response.status(201).json(payload);
  }
}
