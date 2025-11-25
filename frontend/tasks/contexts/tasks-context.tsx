"use client";

import { createContext, useContext, useOptimistic } from "react";
import type { TaskType } from "@/lib/schemas/task-schema";
import type { TasksContextType } from "../types/tasks-context-type";

const TasksContext = createContext<TasksContextType | null>(null);

export function useTasksContext() {
	const context = useContext(TasksContext);
	if (!context) {
		throw new Error("useTasksContext must be used within TasksProvider");
	}
	return context;
}

export default function TasksProvider({
	children,
	initialTasks,
}: {
	children: React.ReactNode;
	initialTasks?: TaskType[];
}) {
	const [optimisticTasks, setOptimisticTasks] = useOptimistic(initialTasks!);

	return (
		<TasksContext.Provider
			value={{
				tasks: optimisticTasks,
				setTasks: setOptimisticTasks,
			}}
		>
			{children}
		</TasksContext.Provider>
	);
}
