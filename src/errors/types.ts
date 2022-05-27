import { Response, Request, NextFunction, ErrorRequestHandler } from 'express';

export interface HandleErrorArgs {
  err: Error & { statusCode?: number };
  req: Request;
  res: Response;
  next: NextFunction;
}
