import { ContentfulStatusCode } from "hono/utils/http-status";

export class HttpException extends Error {
  public status: ContentfulStatusCode;
  public message: string;
  public stack?: string | undefined;

  constructor(status: ContentfulStatusCode, message: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.stack = new Error().stack;
  }
}
