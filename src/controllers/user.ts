import * as express from 'express';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { LoginPayload } from './types';
import { User } from '../models/User.entity';
import { AppDataSource } from '../data-source';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ConflictError } from '../errors/ConflictError';

dotenv.config();

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { username, password }: LoginPayload = req.body;
  const usersRepository = AppDataSource.getRepository(User);

  try {
    const user = await usersRepository.findOneBy({ username });
    if (!user) throw new UnauthorizedError('Incorrect credentials');
    else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new UnauthorizedError('Incorrect credentials');
      else {
        const secret = NODE_ENV === 'production' ? JWT_SECRET! : 'dev-secret';
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });
        res.send({ token });
      }
    }
  } catch (err) {
    next(err);
  }
};

export const signup = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { username, password }: LoginPayload = req.body;
  const usersRepository = AppDataSource.getRepository(User);

  try {
    const user = await usersRepository.findOneBy({ username });
    if (user) throw new ConflictError('User with this username already exists');
    else {
      const hashedPass = await bcrypt.hash(password, 10);
      await usersRepository.save({ username, password: hashedPass });
      res.send({ message: `User ${username} created` });
    }
  } catch (err) {
    next(err);
  }
};
