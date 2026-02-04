import { AppLogger } from "@platform/logger/logger";
import mongoose, { Mongoose } from "mongoose";
import { DbConnectorFactory } from "./connection-factory/db.factory";
import { ConnectorType } from "./types/connector.type";

const logger = new AppLogger("db-connector");

let connectionPromise: Promise<Mongoose> | null = null;

export function connectMongoDb(): Promise<Mongoose> {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const connector = await DbConnectorFactory.createConnector(
        ConnectorType.MONGOOSE,
      );

      const connectPromise = connector.connect<Mongoose>();

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("MongoDB connection timeout")),
          10_000,
        ),
      );

      const conn = await Promise.race([connectPromise, timeoutPromise]);

      logger.info("Successfully connected to MongoDB");
      return conn;
    } catch (err: any) {
      connectionPromise = null;
      logger.error("Failed to connect MongoDB", {
        message: err?.message,
        code: err?.code,
        stack: err?.stack,
      });
      throw new Error("DATABASE_CONNECTION_FAILED");
    }
  })();

  return connectionPromise;
}
