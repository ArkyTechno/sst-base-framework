import { ConnectorType, DbConnector } from "@platform/db/types/connector.type";
import { MongooseConnector } from "@platform/db/connection-factory/mongoose.connector";

export class DbConnectorFactory {
  static async createConnector(type: ConnectorType): Promise<DbConnector> {
    switch (type) {
      case ConnectorType.MONGOOSE:
        return new MongooseConnector();
      // Additional connectors can be added here
      default:
        throw new Error(`Unsupported connector type: ${type}`);
    }
  }
}
