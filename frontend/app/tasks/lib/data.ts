export type Task = {
	id: string;
	title: string;
	description?: string;
	status: "not started" | "started" | "completed";
	priority?: "low" | "medium" | "high";
};

export const initialTasks: Task[] = [
	{
		id: crypto.randomUUID(),
		title: "Buy groceries",
		description: "Milk, eggs, bread, and fruits",
		status: "not started",
		priority: "medium",
	},
	{
		id: crypto.randomUUID(),
		title: "Finish project report",
		description: "Draft final slides and summary",
		status: "started",
		priority: "high",
	},
	{
		id: crypto.randomUUID(),
		title: "Workout",
		description: "30 minutes cardio + stretching",
		status: "completed",
		priority: "low",
	},
];
