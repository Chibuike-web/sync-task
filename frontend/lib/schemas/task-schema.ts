import { z } from "zod";

export const taskSchema = z.object({
	taskId: z.string().optional(),
	taskName: z.string().min(1, "Task name is required"),
	taskDescription: z.string().min(1, "Task description is required"),
	taskStatus: z.string().min(1, "Task status is required"),
	taskStartDate: z.string().min(1, "Task start date is required"),
	taskDueDate: z.string().min(1, "Task due date is required"),
	taskPriority: z.string().min(1, "Task priority is required"),
	status: z.enum(["deleting", "editing"]).optional(),
});

export type TaskType = z.infer<typeof taskSchema>;
