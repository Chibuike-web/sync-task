import { z } from "zod";

const taskSchema = z.object({
	taskName: z.string().min(1, "Task name is required"),
	taskDescription: z.string().min(1, "Task description is required"),
	startDate: z.string().min(1, "Start date is required"),
});
