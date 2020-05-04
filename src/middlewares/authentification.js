import { isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';
import { Error as JSONApiError } from 'jsonapi-serializer';

export const isAuthenticated = (request, response, next) => {
  let authorization = request.headers.authorization;
  if (isUndefined(authorization)) {
    const error = new JSONApiError({ status: 401, detail: 'Missing jwt header' });
    response.status(401).json(error);
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
