import { create } from "zustand";
import { type Task } from "../lib/data";

type TaskStoreType = {
	tasks: Task[];
	setTasks: (value: Task[]) => void;
};

export const useTaskStore = create<TaskStoreType>((set) => ({
	tasks: [],
	setTasks: (value: Task[]) => set({ tasks: value }),
}));
