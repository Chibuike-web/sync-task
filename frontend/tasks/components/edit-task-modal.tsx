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
import { taskSchema, TaskType } from "@/lib/schemas/task-schema";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

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
		resolver: zodResolver(taskSchema),
		defaultValues: {
			taskName: task.taskName,
			taskDescription: task.taskDescription,
			taskStatus: task.taskStatus,
			taskPriority: task.taskPriority,
			taskStartDate: task.taskStartDate,
			taskDueDate: task.taskDueDate,
		},
	});

	const handleEditTask = (data: TaskType) => {
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
					close();
					reset();
					return;
				}

				if (resData.status === "failed") {
					setError(resData.error);
					return;
				}
				close();
				reset();
			} catch (error) {
				setError(error instanceof Error ? error.message : "Server error");
			}
		});
	};

	return (
		<DialogContent className="rounded-2xl flex flex-col gap-6">
			<p id="edit-task-description" className="sr-only">
				Use this form to edit a task with name, description, dates, and priority.
			</p>
			<DialogHeader className="flex justify-between items-center">
				<DialogTitle className="text-xl font-semibold text-left">Edit Task</DialogTitle>
				<DialogClose asChild>
					<button onClick={close}>
						<X className="size-6" />
						<span className="sr-only">Close</span>
					</button>
				</DialogClose>
			</DialogHeader>

			<form className="flex flex-col gap-4" onSubmit={handleSubmit(handleEditTask)}>
				<div className="flex flex-col gap-2">
					<Label htmlFor="taskName" className="text-sm font-medium">
						Task name
					</Label>
					<Input
						id="taskName"
						placeholder="Enter your name"
						className="text-[1rem] placeholder:text-[1rem]"
						{...register("taskName")}
						aria-describedby={errors.taskName ? "task-name-error" : undefined}
						aria-invalid={!!errors.taskName}
					/>
					{errors.taskName && (
						<p id="task-name-error" className="text-red-500 text-[14px] ">
							{errors.taskName.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="taskDescription" className="text-sm font-medium">
						Description
					</Label>
					<Textarea
						id="taskDescription"
						placeholder="Enter description"
						className="text-[1rem] placeholder:text-[1rem]"
						{...register("taskDescription")}
						aria-describedby={errors.taskDescription ? "task-description-error" : undefined}
						aria-invalid={!!errors.taskDescription}
					/>
					{errors.taskDescription && (
						<p id="task-description-error" className="text-red-500 text-[14px] ">
							{errors.taskDescription.message}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="taskStatus" className="text-sm font-medium">
						Status
					</Label>
					<Controller
						name="taskStatus"
						control={control}
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger
									className="w-full text-[16px]"
									aria-describedby={errors.taskStatus ? "task-status-error" : undefined}
									aria-invalid={!!errors.taskStatus}
								>
									<SelectValue placeholder="Not Started" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="not started">Not Started</SelectItem>
									<SelectItem value="started">Started</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.taskStatus && (
						<p id="task-status-error" className="text-red-500 text-[14px] ">
							{errors.taskStatus.message}
						</p>
					)}
				</div>

				<div className="grid sm:grid-cols-2 gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="startDate" className="text-sm font-medium">
							Start Date
						</Label>
						<Controller
							name="taskStartDate"
							control={control}
							render={({ field }) => (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											data-empty={!field.value}
											aria-describedby={errors.taskStartDate ? "task-start-date-error" : undefined}
											aria-invalid={!!errors.taskStartDate}
											className="data-[empty=true]:text-muted-foreground justify-between text-left font-normal active:scale-100 text-[16px]"
										>
											{field.value ? format(field.value, "PPP") : <span>Enter start date</span>}
											<CalendarIcon className="size-4" />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="start">
										<Calendar
											mode="single"
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
										/>
									</PopoverContent>
								</Popover>
							)}
						/>
						{errors.taskStartDate && (
							<p id="task-start-date-error" className="text-red-500 text-[14px] ">
								{errors.taskStartDate.message}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="startDate" className="text-sm font-medium">
							Due Date
						</Label>
						<Controller
							name="taskDueDate"
							control={control}
							render={({ field }) => (
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											data-empty={!field.value}
											className="data-[empty=true]:text-muted-foreground justify-between text-left font-normal active:scale-100 text-[16px]"
											aria-describedby={errors.taskDueDate ? "task-due-date-error" : undefined}
											aria-invalid={!!errors.taskDueDate}
										>
											{field.value ? format(field.value, "PPP") : <span>Enter due date</span>}
											<CalendarIcon className="size-4" />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="start">
										<Calendar
											mode="single"
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
										/>
									</PopoverContent>
								</Popover>
							)}
						/>
						{errors.taskDueDate && (
							<p id="task-due-date-error" className="text-red-500 text-[14px] ">
								{errors.taskDueDate.message}
							</p>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="taskPriority" className="text-sm font-medium">
						Priority
					</Label>
					<Controller
						name="taskPriority"
						control={control}
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger
									className="w-full text-[16px]"
									aria-describedby={errors.taskPriority ? "task-priority-error" : undefined}
									aria-invalid={!!errors.taskPriority}
								>
									<SelectValue placeholder="Low" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
					{errors.taskPriority && (
						<p id="task-priority-error" className="text-red-500 text-[14px] ">
							{errors.taskPriority.message}
						</p>
					)}
				</div>

				<DialogFooter>
					<Button type="button" variant="outline" onClick={close}>
						Cancel
					</Button>
					<Button disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
