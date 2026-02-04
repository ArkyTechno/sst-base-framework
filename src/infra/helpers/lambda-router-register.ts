import { HandlerMetadata } from "@platform/http/types/handler-metadata";

// Function to register Tag Handler routes
export const registerHandlerRoutes = (
  api: sst.aws.ApiGatewayV1,
  handlerMetadata: HandlerMetadata,
  link?: any[],
) => {
  let handler: sst.aws.Function | undefined = undefined;

  handlerMetadata.apiGateway.forEach((route) => {
    if (!handler) {
      handler = new sst.aws.Function(route.functionName, {
        handler: route.handlerPath,
        name: route.functionName,
        memory: "2048 MB",
        runtime: "nodejs22.x",
        link: link,
      });
    }

    api.route(route.path, handler.arn);
  });
};
