import { TaskType } from "@/lib/schemas/task-schema";
import { CreateTaskActionResponseType } from "./create-task-action-response-type";

export type TasksContextType = {
	tasks: TaskType[];
	handleCreateTask: (data: TaskType) => Promise<CreateTaskActionResponseType>;
};
