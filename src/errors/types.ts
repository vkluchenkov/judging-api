import * as express from 'express';

export interface HandleErrorArgs {
  err: Error & { statusCode?: number };
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;
}
