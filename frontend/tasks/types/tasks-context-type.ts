import { TaskType } from "@/lib/schemas/task-schema";

export type TasksContextType = {
	tasks: TaskType[];
	setTasks: (value: TaskType[]) => void;
};
