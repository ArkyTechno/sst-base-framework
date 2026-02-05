import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.email(),
  role: z.string().refine((val) => ["employee", "admin"].includes(val), {
    message: "Role must be either 'employee' or 'admin'",
  }),
  employeeId: z.string(),
  profilePictureUrl: z.url().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type UserDto = z.infer<typeof UserSchema>;