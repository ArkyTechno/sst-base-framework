import { Context, Next } from "hono";
import { ZodSchema, z } from "zod";

type Targets = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
};

export const validateRequest =
  (targets: Targets) =>
  async (c: Context, next: Next) => {
    const validated: Record<string, unknown> = {};

    // ---- BODY ----
    if (targets.body) {
      const json = await c.req.json().catch(() => null);

      const result = targets.body.safeParse(json);

      if (!result.success) {
        return c.json(
          {
            message: "Invalid request body",
            errors: result.error.flatten(),
          },
          400
        );
      }

      validated.body = result.data;
    }

    // ---- QUERY ----
    if (targets.query) {
      const query = c.req.query();

      const result = targets.query.safeParse(query);

      if (!result.success) {
        return c.json(
          {
            message: "Invalid query parameters",
            errors: result.error.flatten(),
          },
          400
        );
      }

      validated.query = result.data;
    }

    // ---- PARAMS ----
    if (targets.params) {
      const params = c.req.param();

      const result = targets.params.safeParse(params);

      if (!result.success) {
        return c.json(
          {
            message: "Invalid route parameters",
            errors: result.error.flatten(),
          },
          400
        );
      }

      validated.params = result.data;
    }

    // Attach everything
    c.set("validated", validated);

    await next();
};
