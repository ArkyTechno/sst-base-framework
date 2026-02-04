import mongoose from "mongoose";
import { Resource } from "sst";
import { DbConnector } from "@platform/db/types/connector.type";

export class MongooseConnector implements DbConnector {
  async connect<T>(): Promise<T> {
    const mongoUri = Resource.MONGODB_URI.value;
    console.log("Connecting to MongoDB at URI:", mongoUri);
    return (await mongoose.connect(mongoUri)) as T;
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
