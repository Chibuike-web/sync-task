import { TaskType } from "@/lib/schemas/task-schema";

export type CreateTaskActionResponseType = {
	status: "success" | "failed";
	error?: string;
	data?: TaskType;
};
