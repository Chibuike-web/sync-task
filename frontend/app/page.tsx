import { Suspense } from "react";
import TasksClient from "./tasks-client";
import { fetchTasks } from "@/lib/api/fetch-tasks";

async function Tasks() {
	const tasks = await fetchTasks();
	return <TasksClient tasks={tasks} />;
}

export default function Home() {
	return (
		<Suspense fallback={<p>Loading tasks...</p>}>
			<Tasks />
		</Suspense>
	);
}
