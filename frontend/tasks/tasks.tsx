import TasksClient from "./tasks-client";
import { fetchTasks } from "@/lib/api/fetch-tasks";

export default async function Tasks() {
	const response = await fetchTasks();

	if (response?.status === "failed") {
		return <div>Something went wrong</div>;
	}
	return <TasksClient tasks={response?.data} />;
}
