import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

export const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer '))
      throw new UnauthorizedError('Incorrect or missing token');

    const token = authorization.replace('Bearer ', '');
    const secret = NODE_ENV === 'production' ? JWT_SECRET! : 'dev-secret';

    if (!token) throw new UnauthorizedError('Incorrect or missing token');

    const payload = jwt.verify(token, secret);

    if (!payload) throw new UnauthorizedError('Incorrect or missing token');

    req.user = payload as unknown as number;

    next();
  } catch (err) {
    next(err);
  }
};
