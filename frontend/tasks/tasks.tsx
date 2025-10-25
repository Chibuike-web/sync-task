import TasksProvider from "@/tasks/contexts/tasks-context";
import { fetchTasks } from "@/lib/api/fetch-tasks";

export default async function Tasks({ children }: { children: React.ReactNode }) {
	const response = await fetchTasks();

	if (response?.status === "failed") {
		return (
			<div className="w-full py-8 text-center text-red-600">Something went wrong loading tasks</div>
		);
	}

	const tasks = response?.data || [];

	return <TasksProvider initialTasks={tasks}>{children}</TasksProvider>;
}
