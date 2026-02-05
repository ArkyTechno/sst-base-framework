import { Hono } from "hono";
import { etag } from "hono/etag";
import { handle, type LambdaContext } from "hono/aws-lambda";
import { HandlerMetadata } from "@platform/http/types/handler-metadata";
import { AppLogger } from "@platform/logger/logger";
import { HttpException } from "@platform/exceptions/http-exception";
import { dbMiddleware } from "@platform/middlewares/db-middleware";

type Bindings = {
  lambdaContext: LambdaContext;
};

export interface ApiRouteMetadata {
  path: string;
  handlerPath: string;
  serviceName: string;
  functionName: string;
}

export interface HonoAppInitOptions {
  app: Hono<{ Bindings: Bindings }>;
  basePath: string;
  appHandler: ReturnType<typeof handle>;
  functionMetadata: HandlerMetadata;
}

declare namespace globalThis {
  // eslint-disable-next-line no-var
  var __RID__: string;
}

export class HonoApp {
  private app: Hono<{ Bindings: Bindings }>;

  private constructor() {
    this.app = new Hono<{ Bindings: Bindings }>();

    this.app.use(etag());

    // Request ID Middleware
    this.app.use("*", async (c, next) => {
      const rid = c.env.lambdaContext.awsRequestId || crypto.randomUUID();
      globalThis.__RID__ = rid;
      await next();
    });

    // Database Middleware
    this.app.use("*", dbMiddleware);

    // Logging Middleware
    this.app.use("*", async (c, next) => {
      const start = Date.now();

      await next();

      const ms = Date.now() - start;
      const awsRequestId = c.env.lambdaContext.awsRequestId;

      console.log(
        JSON.stringify({
          ts: new Date().toISOString(),
          method: c.req.method,
          path: c.req.path,
          status: c.res.status,
          time: `${ms} ms`,
          rid: awsRequestId,
        }),
      );
    });

    this.app.onError((err, c) => {
      const logger = new AppLogger("HonoApp");
      logger.error(err.message, {
        stack: err.stack,
      });

      if (err instanceof HttpException) {
        return c.json({ error: err.message }, err.status);
      }

      if (err.message === "DATABASE_CONNECTION_FAILED") {
        return c.json({ error: "Service temporarily unavailable" }, 503);
      }

      return c.json({ error: "Internal server error" }, 500);
    });
  }

  public initializeHandler(
    handlerPath: string,
    serviceName: string,
    path?: string,
    functionName?: string,
  ): HonoAppInitOptions {
    const basePath = (() => {
      if (!path) {
        return "";
      }

      return path.startsWith("/") ? path : `/${path}`;
    })();

    return {
      app: this.app,
      basePath,
      appHandler: handle(this.app),
      functionMetadata: this.getAwsMetadata(
        handlerPath,
        basePath,
        serviceName,
        functionName,
      ),
    };
  }

  public getAwsMetadata(
    handlerPath: string,
    basePath: string,
    serviceName: string,
    functionName?: string,
  ): HandlerMetadata {
    const serviceFunctionIdentifier = functionName
      ? `${serviceName}-${functionName}`
      : `${serviceName}-${basePath}-proxy-function`;

    const metadata: HandlerMetadata = {
      apiGateway: [
        {
          path: `ANY ${basePath}`,
          handlerPath: handlerPath,
          functionName: serviceFunctionIdentifier,
        },
        {
          path: `ANY ${basePath}/{proxy+}`,
          handlerPath: handlerPath,
          functionName: serviceFunctionIdentifier,
        },
      ],
    };

    return metadata;
  }

  static getApp({
    handlerPath,
    path,
    serviceName,
    functionName,
  }: ApiRouteMetadata): HonoAppInitOptions {
    return new HonoApp().initializeHandler(
      handlerPath,
      serviceName,
      path,
      functionName,
    );
  }
}
