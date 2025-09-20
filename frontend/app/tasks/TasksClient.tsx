"use client";

import { Bell, EllipsisVertical, Plus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { initialTasks, Task } from "./lib/data";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogAction, AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { useTaskStore } from "./store/taskStore";

export default function TasksClient() {
	const { tasks, setTasks } = useTaskStore();

	useEffect(() => {
		const stored = localStorage.getItem("tasks");
		if (stored) {
			const parsedTasks = JSON.parse(stored);
			setTasks(parsedTasks);
		} else {
			localStorage.setItem("tasks", JSON.stringify(initialTasks));
			setTasks(initialTasks);
		}
	}, []);
	return (
		<div>
			<header className="py-6 border-b border-sidebar-border">
				<nav className="flex items-center justify-between max-w-[700px] mx-auto">
					<h1 className="tracking-[-0.05em] text-[20px] font-bold">SyncTask</h1>
					<div className="flex gap-6 items-center">
						<Button className="text-[16px]" size="lg">
							<Plus className="w-5 h-5" />
							<span>Create Task</span>
						</Button>
						<div className="flex items-center gap-2">
							<button className="p-2" type="button">
								<Bell />
							</button>
							<button className="p-2" type="button">
								<Search />
							</button>
						</div>
					</div>
				</nav>
			</header>
			<main className="flex items-center justify-between max-w-[700px] mx-auto mt-10">
				<Tabs defaultValue="all" className="w-full">
					<TabsList className="w-max">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="not started">Not Started</TabsTrigger>
						<TabsTrigger value="started">Started</TabsTrigger>
						<TabsTrigger value="completed">Completed</TabsTrigger>
					</TabsList>
					<TabsContent value="all">
						<AllTasks />
					</TabsContent>
					<TabsContent value="started">
						<StartedTasks />
					</TabsContent>
					<TabsContent value="not started">
						<NotStartedTasks />
					</TabsContent>
					<TabsContent value="completed">
						<CompletedTasks />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}

const AllTasks = () => {
	const { tasks } = useTaskStore();
	return <TaskItem tasks={tasks} />;
};

const StartedTasks = () => {
	const { tasks } = useTaskStore();
	const startedTasks = tasks.filter((t) => t.status === "started");
	return <TaskItem tasks={startedTasks} />;
};

const NotStartedTasks = () => {
	const { tasks } = useTaskStore();
	const notStartedTasks = tasks.filter((t) => t.status === "not started");
	return <TaskItem tasks={notStartedTasks} />;
};

const CompletedTasks = () => {
	const { tasks } = useTaskStore();
	const completedTasks = tasks.filter((t) => t.status === "completed");
	return <TaskItem tasks={completedTasks} />;
};

const TaskItem = ({ tasks }: { tasks: Task[] }) => {
	return (
		<div className="flex flex-col gap-4">
			{tasks.map((task) => (
				<div key={task.id} className=" bg-white border rounded-xl p-4 hover:shadow-md transition">
					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-3 flex-wrap">
							<h3 className="font-semibold text-[clamp(14px,5vw,18px)] break-words leading-[1.2]">
								{task.title}
							</h3>

							<div className="flex items-center gap-2">
								{/* Status Badge */}
								<span
									className={`inline-block px-2 py-1 text-[clamp(10px,2vw,12px)] font-medium rounded-full leading-[1]
						${task.status === "not started" ? "bg-gray-100 text-gray-700" : ""}
						${task.status === "started" ? "bg-yellow-100 text-yellow-700" : ""}
						${task.status === "completed" ? "bg-green-100 text-green-700" : ""}`}
								>
									{task.status}
								</span>

								{/* Priority Badge */}
								<span
									className={`inline-block px-2 py-1 text-[clamp(10px,2vw,12px)] font-medium rounded-full leading-[1]
						${task.priority === "low" ? "bg-gray-100 text-gray-700" : ""}
						${task.priority === "medium" ? "bg-blue-100 text-blue-700" : ""}
						${task.priority === "high" ? "bg-red-100 text-red-700" : ""}`}
								>
									{task.priority}
								</span>
							</div>
						</div>

						{/* Menu */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button>
									<EllipsisVertical className="size-4" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-max rounded-[12px]">
								<DropdownMenuItem className="px-4 py-2">Mark as Completed</DropdownMenuItem>
								<DropdownMenuItem className="px-4 py-2">Edit Task</DropdownMenuItem>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<DropdownMenuItem
											className="px-4 py-2"
											onSelect={(event) => {
												event.preventDefault();
											}}
										>
											Delete Task
										</DropdownMenuItem>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete Post</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete this post? This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												<Button variant="outline">Cancel</Button>
											</AlertDialogCancel>
											<AlertDialogAction>
												{" "}
												<Button variant="destructive">Delete</Button>
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<p>{task.description}</p>
				</div>
			))}
		</div>
	);
};
