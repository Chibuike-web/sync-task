"use client";

import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateTaskModal from "@/tasks/components/create-task-modal";
import { useTasksContext } from "./contexts/tasks-context";
import { TabsContent } from "@/components/ui/tabs";
import TaskItem from "./task-item";

export default function TasksClient() {
	return (
		<>
			<Dialog>
				<DialogTrigger
					id="create-task-description"
					className="text-[16px] flex gap-2 bg-foreground h-10 px-4 text-white items-center justify-center rounded-[10px]"
				>
					<Plus className="w-5 h-5" />
					<span>Create Task</span>
				</DialogTrigger>
				<CreateTaskModal />
			</Dialog>

			<Tabs defaultValue="all" className="w-full">
				<TabsList className="w-max">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="not started">Not Started</TabsTrigger>
					<TabsTrigger value="started">Started</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
				</TabsList>

				<TasksTabContent />
			</Tabs>
		</>
	);
}

function TasksTabContent() {
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
