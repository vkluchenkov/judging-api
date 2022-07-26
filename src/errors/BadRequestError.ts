import { ServerError } from './ServerError';

export class BadRequestError extends Error implements ServerError {
  public statusCode = 400;
  public name = 'BadRequestError';
}
