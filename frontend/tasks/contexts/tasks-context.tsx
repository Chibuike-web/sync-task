"use client";

import { createContext, startTransition, useContext, useOptimistic } from "react";
import type { TaskType } from "@/lib/schemas/task-schema";
import { createTaskAction } from "@/actions/create-task-action";
import type { TasksContextType } from "../types/tasks-context-type";
import { deleteTaskAction } from "@/actions/delete-task-action";
import { CreateTaskReturnType } from "../types/create-task-response-type";
import { useParams } from "next/navigation";

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
	const params = useParams();
	const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
	if (!userId) return null;

	const handleCreateTask = async (data: TaskType): CreateTaskReturnType => {
		startTransition(() => {
			const tempTask = { ...data, taskId: `temp-${Date.now()}` };
			setOptimisticTasks((prev) => [...prev, tempTask]);
		});

		try {
			const resData = await createTaskAction(data, userId);
			console.log(resData);
			return resData;
		} catch (error) {
			console.error(error);
			startTransition(() => setOptimisticTasks(initialTasks));
			return { status: "failed", error: "Something went wrong" };
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		startTransition(async () => {
			setOptimisticTasks(
				optimisticTasks.map((task) =>
					task.taskId === taskId ? { ...task, status: "deleting" } : task
				)
			);
		});
		try {
			const res = await deleteTaskAction(userId, taskId);
			if (res.status === "failed") {
				console.log("failed");
				return;
			}
		} catch (error) {
			console.error(error);
			startTransition(() => setOptimisticTasks(initialTasks));
		}
	};

	return (
		<TasksContext.Provider value={{ tasks: optimisticTasks, handleCreateTask, handleDeleteTask }}>
			{children}
		</TasksContext.Provider>
	);
}
