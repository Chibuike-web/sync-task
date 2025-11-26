"use client";

import { EllipsisVertical, X } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskType } from "@/lib/schemas/task-schema";
import { cn } from "@/lib/utils/cn";
import { useTasksContext } from "./contexts/tasks-context";
import { Fragment, startTransition, useState } from "react";
import { deleteTaskAction } from "@/actions/delete-task-action";
import { useParams, useRouter } from "next/navigation";
import { editTaskAction } from "@/actions/edit-task-action";
import EditTaskModal from "./components/edit-task-modal";
import { completeTaskAction } from "@/actions/complete-task-action";

function getStatusColor(status: string) {
	return cn({
		"bg-gray-100 text-gray-700": status === "not started",
		"bg-yellow-100 text-yellow-700": status === "started",
		"bg-green-100 text-green-700": status === "completed",
	});
}

function getPriorityColor(priority: string) {
	return cn({
		"bg-gray-100 text-gray-700": priority === "low",
		"bg-blue-100 text-blue-700": priority === "medium",
		"bg-red-100 text-red-700": priority === "high",
	});
}

export default function TaskItem({ tasks }: { tasks: TaskType[] }) {
	const { setTasks } = useTasksContext();
	const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
	const params = useParams<{ userId: string }>();
	const router = useRouter();
	const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
	if (!userId) return null;

	const handleDeleteTask = async (taskId: string) => {
		startTransition(async () => {
			setTasks(
				tasks.map((task) => (task.taskId === taskId ? { ...task, status: "deleting" } : task))
			);
			try {
				const resData = await deleteTaskAction(userId, taskId);
				if (
					resData.status === "redirect" ||
					resData.status === "expired" ||
					resData.status === "unauthorized"
				) {
					router.replace("/sign-in");
					return;
				}
				if (resData.status === "failed") {
					console.log("failed");
					return;
				}
			} catch (error) {
				console.error(error);
			}
		});
	};
	return (
		<div className="flex flex-col gap-4">
			{tasks.map((task) => (
				<Fragment key={task.taskId}>
					<div
						className={cn(
							"bg-white border rounded-xl p-4",
							task.status && "opacity-50",
							task.taskStatus === "completed" && "opacity-50 cursor-not-allowed"
						)}
					>
						<div className="w-full flex justify-between items-center">
							<div className="flex items-center gap-3 flex-wrap">
								<h3 className="font-semibold text-[clamp(14px,5vw,18px)] break-words leading-[1.2]">
									{task.taskName}
								</h3>

								<div className="flex items-center gap-2">
									{/* Status Badge */}
									<span
										className={cn(
											"inline-block px-2 py-1 text-[clamp(10px,2vw,12px)] font-medium rounded-full leading-[1]",
											getStatusColor(task.taskStatus)
										)}
									>
										{task.taskStatus}
									</span>

									{/* Priority Badge */}
									<span
										className={cn(
											"inline-block px-2 py-1 text-[clamp(10px,2vw,12px)] font-medium rounded-full leading-[1]",
											getPriorityColor(task.taskPriority)
										)}
									>
										{task.taskPriority}
									</span>
								</div>
							</div>

							{/* Menu */}
							<DropdownMenu>
								<DropdownMenuTrigger
									className={cn(task.taskStatus === "completed" && "opacity-50")}
								>
									<EllipsisVertical className="size-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-max rounded-[12px]">
									<DropdownMenuItem
										className={cn(
											"px-4 py-2",
											task.taskStatus === "completed" && "opacity-50 pointer-events-none"
										)}
										onClick={() => {
											completeTaskAction(userId, task.taskId ?? "");
										}}
									>
										Mark as Completed
									</DropdownMenuItem>
									<DropdownMenuItem className="px-4 py-2" onClick={() => setSelectedTask(task)}>
										Edit Task
									</DropdownMenuItem>
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
											<AlertDialogHeader className="flex justify-between w-full items-center">
												<AlertDialogTitle>Delete Task</AlertDialogTitle>
												<AlertDialogCancel
													variant="ghost"
													className="size-10 px-0 py-0 flex items-center justify-center"
												>
													<X className="size-5" />
												</AlertDialogCancel>
											</AlertDialogHeader>
											<AlertDialogDescription>
												Are you sure you want to delete this task? This action cannot be undone.
											</AlertDialogDescription>

											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													variant="destructive"
													onClick={() => handleDeleteTask(task.taskId ?? "")}
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<p className="mt-2">{task.taskDescription}</p>
					</div>
					{selectedTask && (
						<EditTaskModal
							task={selectedTask}
							userId={userId}
							close={() => setSelectedTask(null)}
						/>
					)}
				</Fragment>
			))}
		</div>
	);
}
