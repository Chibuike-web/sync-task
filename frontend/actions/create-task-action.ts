"use server";

import { CreateTaskActionResponseType } from "@/components/create-task-modal";
import { TaskType } from "@/lib/schemas/task-schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTaskAction(data: TaskType): Promise<CreateTaskActionResponseType> {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	const res = await fetch("http://localhost:3222/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json", Cookie: cookieHeader },
		credentials: "include",
		body: JSON.stringify(data),
	});
	const resData = await res.json();

	if (!res.ok) {
		return { status: "failed", error: resData.error || "Failed to create task" };
	}

	revalidatePath("/");
	return { status: "success", data: resData };
}
