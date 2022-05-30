import { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { LoginPayload } from './types';
import { User } from '../models/User.entity';
import { AppDataSource } from '../data-source';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ConflictError } from '../errors/ConflictError';

config();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { username, password }: LoginPayload = req.body;
  const usersRepository = AppDataSource.getRepository(User);

  try {
    const user = await usersRepository.findOneBy({ username });
    if (!user) throw new UnauthorizedError('Incorrect credentials');
    else {
      const match = await compare(password, user.password);
      if (!match) throw new UnauthorizedError('Incorrect credentials');
      else {
        const secret = NODE_ENV === 'production' ? JWT_SECRET! : 'dev-secret';
        const token = sign({ id: user.id }, secret, { expiresIn: '7d' });
        res.send({ token });
      }
    }
  } catch (err) {
    next(err);
  }
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password }: LoginPayload = req.body;
  const usersRepository = AppDataSource.getRepository(User);

  try {
    const user = await usersRepository.findOneBy({ username });
    if (user) throw new ConflictError('User with this username already exists');
    else {
      const hashedPass = await hash(password, 10);
      await usersRepository.save({ username, password: hashedPass });
      res.send({ message: `User ${username} created` });
    }
  } catch (err) {
    next(err);
  }
};

export const getUser = async (id: number) => {
  return await AppDataSource.getRepository(User)
    .createQueryBuilder('user')
    .where('user.id = :id', { id })
    .leftJoinAndSelect('user.judge', 'judge')
    .getOne();
};
