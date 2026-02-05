import { AppServices } from "@platform/db/types/app-services.type";
import { HonoApp } from "@platform/http/hono-init";
import { UserService } from "@services/user-manage-service/services/user.service";

const { app, basePath, appHandler, functionMetadata } = HonoApp.getApp({
  handlerPath: "src/services/user-manage-service/handlers/user.handler.handler",
  serviceName: AppServices.USER_MANAGE_SERVICE,
  path: "users",
  functionName: "user-handler",
});

const userService = new UserService();

app.get(basePath + "/health", async (c) => {
  return c.json({
    status: "Success",
    region: process.env.AWS_REGION || "local",
  });
});

app.get(basePath, async (c) => {
  const tags = await userService.getUsers();
  return c.json({ tags: [...tags], region: process.env.AWS_REGION || "local" });
});

export const handler = appHandler;
export const metadata = functionMetadata;
