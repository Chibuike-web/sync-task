import { TaskType } from "@/lib/schemas/task-schema";
import { CreateTaskReturnType } from "./create-task-response-type";

export type TasksContextType = {
	tasks: TaskType[];
	handleCreateTask: (data: TaskType) => CreateTaskReturnType;
	handleDeleteTask: (id: string) => void;
};
