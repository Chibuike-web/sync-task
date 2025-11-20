"use client";

import { useTasksContext } from "./contexts/tasks-context";
import { TabsContent } from "@/components/ui/tabs";
import TaskItem from "./task-item";

export default function TasksTabContent() {
	const { tasks } = useTasksContext();

	const startedTasks = tasks.filter((t) => t.taskStatus === "started");
	const notStartedTasks = tasks.filter((t) => t.taskStatus === "not started");
	const completedTasks = tasks.filter((t) => t.taskStatus === "completed");

	return (
		<>
			<TabsContent value="all">
				<TaskItem tasks={tasks} />
			</TabsContent>
			<TabsContent value="started">
				<TaskItem tasks={startedTasks} />
			</TabsContent>
			<TabsContent value="not started">
				<TaskItem tasks={notStartedTasks} />
			</TabsContent>
			<TabsContent value="completed">
				<TaskItem tasks={completedTasks} />
			</TabsContent>
		</>
	);
}
