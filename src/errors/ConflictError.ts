import { ServerError } from './ServerError';

export class ConflictError extends Error implements ServerError {
  public statusCode = 409;
  public name = 'ConflictError';
}
