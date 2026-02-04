import { connectMongoDb } from "@platform/db/mongo-connect-singleton";

export const dbMiddleware = async (_c: any, next: any) => {
  await connectMongoDb();
  await next();
};
