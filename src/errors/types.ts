import { Response, Request, NextFunction } from 'express';
import { ServerError } from './ServerError';

export interface HandleErrorArgs {
  err: ServerError;
  req: Request;
  res: Response;
  next: NextFunction;
}

export interface HandleWsErrorArgs {
  err: ServerError;
}
