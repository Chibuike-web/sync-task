"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { editTaskAction } from "@/actions/edit-task-action";
import { useTasksContext } from "@/tasks/contexts/tasks-context";
import { TaskType } from "@/lib/schemas/task-schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EditTaskModal({
	task,
	close,
	userId,
}: {
	task: TaskType;
	close: () => void;
	userId: string;
}) {
	const { tasks, setTasks } = useTasksContext();
	const [error, setError] = useState("");
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			taskName: task.taskName,
			taskDescription: task.taskDescription,
			taskStatus: task.taskStatus,
			taskPriority: task.taskPriority,
			taskStartDate: task.taskStartDate,
			taskDueDate: task.taskDueDate,
		},
	});

	const onSubmit = (data: TaskType) => {
		startTransition(async () => {
			setTasks(tasks.map((t) => (t.taskId === task.taskId ? { ...t, status: "editing" } : t)));

			try {
				const resData = await editTaskAction(userId, task.taskId ?? "", data);
				if (
					resData.status === "redirect" ||
					resData.status === "expired" ||
					resData.status === "unauthorized"
				) {
					router.replace("/sign-in");
					router.refresh();
					return;
				}

				if (resData.status === "failed") {
					setError(resData.error);
					return;
				}
				close();
			} catch (error) {
				setError(error instanceof Error ? error.message : "Server error");
				console.error(error);
			}
		});
	};

	return (
		<Dialog open={true}>
			<DialogContent className="rounded-2xl flex flex-col gap-6">
				<DialogHeader className="flex justify-between items-center">
					<DialogTitle className="text-xl font-semibold">Edit Task</DialogTitle>
					<DialogClose asChild>
						<button onClick={close}>
							<X className="size-6" />
						</button>
					</DialogClose>
				</DialogHeader>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-2">
						<Label>Task Name</Label>
						<Input {...register("taskName")} />
					</div>

					<div className="flex flex-col gap-2">
						<Label>Description</Label>
						<Textarea {...register("taskDescription")} />
					</div>

					<div className="flex flex-col gap-2">
						<Label>Status</Label>
						<Controller
							name="taskStatus"
							control={control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="not started">Not Started</SelectItem>
										<SelectItem value="started">Started</SelectItem>
										<SelectItem value="completed">Completed</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Priority</Label>
						<Controller
							name="taskPriority"
							control={control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className="grid sm:grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<Label>Start Date</Label>
							<Controller
								name="taskStartDate"
								control={control}
								render={({ field }) => (
									<Popover>
										<PopoverTrigger asChild>
											<Button variant="outline">
												{field.value ? format(field.value, "PPP") : "Start Date"}
												<CalendarIcon className="size-4" />
											</Button>
										</PopoverTrigger>
										<PopoverContent>
											<Calendar
												mode="single"
												selected={field.value ? new Date(field.value) : undefined}
												onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
											/>
										</PopoverContent>
									</Popover>
								)}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label>Due Date</Label>
							<Controller
								name="taskDueDate"
								control={control}
								render={({ field }) => (
									<Popover>
										<PopoverTrigger asChild>
											<Button variant="outline">
												{field.value ? format(field.value, "PPP") : "Due Date"}
												<CalendarIcon className="size-4" />
											</Button>
										</PopoverTrigger>
										<PopoverContent>
											<Calendar
												mode="single"
												selected={field.value ? new Date(field.value) : undefined}
												onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
											/>
										</PopoverContent>
									</Popover>
								)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={close}>
							Cancel
						</Button>
						<Button disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
