import { ServerError } from './ServerError';

export class UnauthorizedError extends Error implements ServerError {
  public name = 'UnauthorizedError';
  public statusCode = 401;
}
