import { create } from "zustand";
import { type Task } from "../lib/data";

type TaskStoreType = {
	tasks: Task[];
	setTasks: (value: Task[]) => void;
};

const taskStore = create<TaskStoreType>((set) => ({
	tasks: [],
	setTasks: (value: Task[]) => set({ tasks: value }),
}));

export const useTaskStore = () => {
	const tasks = taskStore((s) => s.tasks);
	const setTasks = taskStore((s) => s.setTasks);

	return {
		tasks,
		setTasks,
	};
};
