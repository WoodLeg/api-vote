import { isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';

export const isAuthenticated = (request, response, next) => {
  let authorization = request.headers.authorization;
  if (isUndefined(authorization)) {
    response.status(401).json({ error: 'Missing jwt' });
    return;
  }

  let [_, hash] = authorization.split(' ');

  try {
    let jwtDecoded = jwt.verify(hash, 'dredd');
    request.body.user = jwtDecoded;
    next();
  } catch (error) {
    response.status(401).json({ error: 'Wrong authentification token' });
    return;
  }
};
