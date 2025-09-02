import { z } from "zod";
import { authSchema } from "./authSchema";
import { todoSchema } from "./todoSchema";

export const userSchema = authSchema.extend({
	todos: z.array(todoSchema).optional(),
});

export type UserType = z.infer<typeof userSchema>;
