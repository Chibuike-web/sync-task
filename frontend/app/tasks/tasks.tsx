import TasksClient from "./tasks-client";
import { fetchTasks } from "@/lib/api/fetch-tasks";

export default async function Tasks() {
	const tasks = await fetchTasks();
	return <TasksClient tasks={tasks} />;
}
