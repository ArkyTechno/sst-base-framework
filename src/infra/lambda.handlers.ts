import { handlerMetadatas as userHandlerMetadatas } from "@services/user-manage-service/service.meta";
import { registerHandlerRoutes } from "@infra/helpers/lambda-router-register";

export const initializeLambdas = (api: sst.aws.ApiGatewayV1, link?: any[]) => {
  //User service lambda handlers
  userHandlerMetadatas.forEach((metadata) => {
    registerHandlerRoutes(api, metadata, link);
  });
};
