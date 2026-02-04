import { HonoApp } from "@platform/http/hono-init";
import { SERVICE_NAME } from "@services/user-manage-service/service.meta";
import { UserService } from "../services/user.service";

const { app, basePath, appHandler, functionMetadata } = HonoApp.getApp({
  handlerPath: "src/services/user-manage-service/handlers/user.handler.handler",
  serviceName: SERVICE_NAME,
  path: "users",
  functionName: "user-handler",
});

const userService = new UserService();

app.get(basePath, async (c) => {
  const tags = await userService.getUsers();
  return c.json({ tags: [...tags], region: process.env.AWS_REGION || "local" });
});

export const handler = appHandler;
export const metadata = functionMetadata;
