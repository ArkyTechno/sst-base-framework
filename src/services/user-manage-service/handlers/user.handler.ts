import { AppServices } from "@platform/db/types/app-services.type";
import { HonoApp } from "@platform/http/hono-init";
import { validateRequest } from "@platform/middlewares/request-validator.middleware";
import { UserService } from "@services/user-manage-service/services/user.service";
import { UserDto, UserSchema } from "../dtos/user.dto";
import { getValidated } from "@platform/config/get-validated";
import { z } from "zod";

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

app.get(`${basePath}/search`,
  validateRequest({ query: UserSchema.pick({ email: true, employeeId: true }).partial().strict() }),
  async (c) => {
    const { query } = getValidated<{ query: { email?: string; employeeId?: string } }>(c);
    const user = await userService.findUserByEmailOrEmployeeId(query.email, query.employeeId);
    return c.json(user);
});

app.get(`${basePath}/:id`, 
  validateRequest({params: UserSchema.pick({ id: true })}), 
  async (c) => {
    const { params } = getValidated<{ params: { id: string } }>(c);

    const user = await userService.getUserById(params.id);
    return c.json(user);
});

app.post(basePath, 
  validateRequest({body: UserSchema}), 
  async (c) => {
    const { body } = getValidated<{ body: UserDto }>(c);
    const newUser = await userService.createUser(body);
    return c.json(newUser);
});

app.put(`${basePath}/:id`,
  validateRequest({params: UserSchema.pick({ id: true }), body: UserSchema}), 
  async (c) => {
    const { params, body } = getValidated<{ params: { id: string }, body: UserDto }>(c);
    const updatedUser = await userService.updateUser(params.id, body);
    return c.json(updatedUser);
});

export const handler = appHandler;
export const metadata = functionMetadata;
