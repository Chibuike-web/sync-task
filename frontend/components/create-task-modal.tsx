"use client";

import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskType } from "@/lib/schemas/task-schema";
import { useTaskStore } from "@/store/taskStore";
import { useOptimistic, useTransition } from "react";

export default function CreateTaskModal() {
	const {
		register,
		reset,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(taskSchema),
	});

	const { tasks, setTasks, addTask } = useTaskStore();
	const [optimisticTasks, setOptimisticTasks] = useOptimistic(tasks);
	const [isPending, startTransition] = useTransition();

	const onSubmit = (data: TaskType) => {
		startTransition(async () => {
			setOptimisticTasks([...tasks, data]);
			try {
				const res = await fetch("http://localhost:3222", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(data),
				});
				const resData = await res.json();
				if (!res.ok) {
					console.error(resData.error);
					throw new Error("Issue creating tasks");
				}
			} catch (error) {}
		});
	};

	return (
		<DialogContent
			aria-describedby="create-task-description"
			className="rounded-[16px] flex flex-col gap-6"
		>
			<p id="create-task-description" className="sr-only">
				Use this form to create a new task with name, description, dates, and priority.
			</p>
			<DialogHeader className="flex justify-between items-center">
				<DialogTitle className="text-xl font-semibold text-left">Create Task</DialogTitle>
				<DialogClose data-slot="dialog-close">
					<X className="size-6" />
					<span className="sr-only">Close</span>
				</DialogClose>
			</DialogHeader>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-2">
					<Label htmlFor="taskName" className="text-sm font-medium">
						Task name
					</Label>
					<Input
						id="taskName"
						placeholder="Enter your name"
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
						defaultValue=""
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
							defaultValue=""
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
							defaultValue=""
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
						defaultValue=""
						render={({ field }) => (
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger
									className="w-full text-[16px]"
									aria-describedby={errors.taskStatus ? "task-priority-error" : undefined}
									aria-invalid={!!errors.taskStatus}
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
				<DialogFooter className="mt-4">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button>Create</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
