"use client";

import { createContext, startTransition, useContext, useOptimistic } from "react";
import type { TaskType } from "@/lib/schemas/task-schema";
import { createTaskAction } from "@/actions/create-task-action";
import type { TasksContextType } from "../types/tasks-context-type";
import type { CreateTaskActionResponseType } from "../types/create-task-action-response-type";

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
	initialTasks: TaskType[];
}) {
	const [optimisticTasks, setOptimisticTasks] = useOptimistic(initialTasks);

	const handleCreateTask = async (data: TaskType): Promise<CreateTaskActionResponseType> => {
		startTransition(() => {
			const tempTask = { ...data, taskId: `temp-${Date.now()}` };
			setOptimisticTasks((prev) => [...prev, tempTask]);
		});

		try {
			const resData = await createTaskAction(data);
			console.log(resData);
			return resData;
		} catch (error) {
			console.error(error);
			startTransition(() => setOptimisticTasks(initialTasks));
			return { status: "failed", error: "Something went wrong" };
		}
	};

	return (
		<TasksContext.Provider value={{ tasks: optimisticTasks, handleCreateTask }}>
			{children}
		</TasksContext.Provider>
	);
}
