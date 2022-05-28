export abstract class ServerError extends Error {
  public abstract name: string;
  public abstract statusCode: number;
}
