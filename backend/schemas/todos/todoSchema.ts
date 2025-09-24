import { z } from "zod";

export const singleTodoSchema = z.object();

export const todoSchema = z.object({
	userId: z.uuid(),
	todos: z.array(
		z.object({
			id: z.uuid(),
			title: z.string(),
		})
	),
});

export type Todo = z.infer<typeof todoSchema>;
