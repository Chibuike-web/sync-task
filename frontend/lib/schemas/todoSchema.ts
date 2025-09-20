import { z } from "zod";

export const todoSchema = z.object({
	id: z.uuid(),
	title: z.string(),
});

export type TodoType = z.infer<typeof todoSchema>;
