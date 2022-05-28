import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';
import { ServerError } from './ServerError';

export interface HandleErrorArgs {
  err: ServerError;
  req: Request;
  res: Response;
  next: NextFunction;
}
