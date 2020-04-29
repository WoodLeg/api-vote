import { isUndefined } from 'lodash';
import jwt from 'jsonwebtoken';

export const identifyUser = (request, response, next) => {
  let authorization = request.headers.authorization;
  if (isUndefined(authorization)) {
    next();
    return;
  }

  let [_, hash] = authorization.split(' ');

  try {
    let jwtDecoded = jwt.verify(hash, 'dredd');
    request.body.user = jwtDecoded;
    next();
  } catch {
    next();
  }
};
