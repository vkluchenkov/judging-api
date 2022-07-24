import { ServerError } from './ServerError';

export class NotFoundError extends Error implements ServerError {
  public statusCode = 404;
  public name = 'NotFoundError';
}
