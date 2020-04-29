import { isNull, isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';
import User from '../../models/user';

export default class UserController {
  static async signin(request, response) {
    let { username, password } = request.body;

    if (isNull(username) || isNull(password) || isUndefined(username) || isUndefined(password)) {
      response.status(422).json({ error: { message: 'Credentials manquants' } });
      return;
    }

    let user;
    try {
      user = await User.findByUsername(username);
    } catch ({ code, message }) {
      if (code === 404) {
        response.status(401).json({ ok: false, error: { message: 'Pseudo ou mot de passe invalide.' } });
        return;
      }
      response.status(code).json({ ok: false, error: { message } });
      return;
    }

    let userAuthenticated = user.testPassword(password);

    let bearer = 'Bearer ';
    bearer += jwt.sign({ username: user.getUsername(), uuid: user.getUuid() }, 'dredd');

    if (userAuthenticated) {
      response.json({ data: { user: { id: user.getId(), uuid: user.getUuid(), username: user.getUsername(), bearer } } });
    } else {
      response.status(401).json({ error: { message: 'Mauvais pseudo/mot de passe' } });
    }
  }

  static async signup(request, response) {
    let { username, password } = request.body;

    if (isNull(username) || isNull(password) || isUndefined(username) || isUndefined(username)) {
      response.status(422).json({ error: { message: 'Aucune information fournie' } });
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
