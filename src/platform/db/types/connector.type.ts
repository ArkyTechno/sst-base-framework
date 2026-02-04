export interface DbConnector {
  connect<T>(): Promise<T>;
  disconnect(): Promise<void>;
}

export enum ConnectorType {
  MONGOOSE = "mongoose",
}
