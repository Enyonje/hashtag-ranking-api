export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
export const BadRequest = (msg: string) => new HttpError(400, msg);
export const Unauthorized = (msg: string) => new HttpError(401, msg);
export const TooManyRequests = (msg: string) => new HttpError(429, msg);