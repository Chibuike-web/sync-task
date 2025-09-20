import { z } from "zod";

export const singleTodoSchema = z.object({
	id: z.uuid(),
	title: z.string(),
});

export const todoGroupSchema = z.object({
	userId: z.uuid(),
	todos: z.array(singleTodoSchema),
});

export type TodoGroup = z.infer<typeof todoGroupSchema>;
