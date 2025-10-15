import { useState } from "react";
import { DialogClose, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TaskErrors } from "@/lib/types";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from "lucide-react";

export default function CreateTaskModal() {
	const [taskErrors, setTaskErrors] = useState<TaskErrors>({
		taskNameError: "",
		taskDescriptionError: "",
		taskStartDateError: "",
		taskDueDateError: "",
	});
	return (
		<DialogContent className="rounded-[16px] flex flex-col gap-6">
			<DialogHeader className="flex justify-between items-center">
				<DialogTitle className="text-xl font-semibold text-left">Create Task</DialogTitle>
				<DialogClose data-slot="dialog-close">
					<X className="size65" />
					<span className="sr-only">Close</span>
				</DialogClose>
			</DialogHeader>
			<form className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="taskName" className="text-sm font-medium">
						Task name
					</Label>
					<Input id="taskName" placeholder="Enter your name" />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="taskDescription" className="text-sm font-medium">
						Description
					</Label>
					<Textarea id="taskDescription" placeholder="Enter description" />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="taskStatus" className="text-sm font-medium">
						Status
					</Label>
					<Select>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Not Started" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="not started">Not Started</SelectItem>
							<SelectItem value="started">Started</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</form>
		</DialogContent>
	);
}
