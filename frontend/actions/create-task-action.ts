"use server";

import { TaskType } from "@/lib/schemas/task-schema";
import { CreateTaskReturnType } from "@/tasks/types/create-task-response-type";
import { revalidatePath, updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createTaskAction(data: TaskType, userId: string): CreateTaskReturnType {
	if (!userId) return redirect("/sign-in");

	const cookieStore = await cookies();
	const cookieName = `token_tasks_${userId}`;

	const cookie = cookieStore.get(cookieName);
	if (!cookie) return redirect("/sign-in");

	const res = await fetch("http://localhost:3222/tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json", Cookie: `${cookieName}=${cookie.value}` },
		body: JSON.stringify(data),
	});
	const resData = await res.json();

	if (res.status === 401 || res.status === 403) {
		if (resData?.error === "Session expired") {
			return { status: "expired" };
		}
		return { status: "unauthorized" };
	}

	if (!res.ok) {
		return { status: "failed", error: resData.error || "Failed to create task" };
	}

	updateTag("tasks");
	return { status: "success", data: resData };
}
