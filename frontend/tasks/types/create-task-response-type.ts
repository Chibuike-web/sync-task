import { TaskType } from "@/lib/schemas/task-schema";

export type CreateTaskResponse =
	| { status: "success"; data: TaskType[] }
	| { status: "failed"; error: string }
	| { status: "expired" }
	| { status: "unauthorized" }
	| { status: "redirect" };

export type CreateTaskReturnType = Promise<CreateTaskResponse>;
