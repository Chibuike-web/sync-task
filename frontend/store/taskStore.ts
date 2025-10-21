import { TaskType } from "@/lib/schemas/task-schema";
import { create } from "zustand";

type TaskStoreType = {
	tasks: TaskType[];
	setTasks: (value: TaskType[]) => void;
	addTask: (value: TaskType) => void;
};

const taskStore = create<TaskStoreType>((set) => ({
	tasks: [],
	setTasks: (value: TaskType[]) => set({ tasks: value }),
	addTask: (value: TaskType) => set((state) => ({ tasks: [...state.tasks, value] })),
}));

export const useTaskStore = () => {
	const tasks = taskStore((s) => s.tasks);
	const setTasks = taskStore((s) => s.setTasks);
	const addTask = taskStore((s) => s.addTask);

	return {
		tasks,
		setTasks,
		addTask,
	};
};
