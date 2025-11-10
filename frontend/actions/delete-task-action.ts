"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteTaskAction(userId: string, taskId: string) {
	if (!userId) return redirect("/sign-in");
	const cookieStore = await cookies();
	const cookieName = `token_tasks_${userId}`;

	const cookie = cookieStore.get(cookieName);
	if (!cookie) return redirect("/sign-in");

	const res = await fetch(`http://localhost:3222/${taskId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json", Cookie: `token_tasks=${cookie.value}` },
	});
	const resData = await res.json();
	if (res.status === 401 || res.status === 403) {
		redirect("/sign-in");
	}

	if (!res.ok) {
		return { status: "failed", error: resData.error || "Failed to create task" };
	}

	revalidatePath("/");
	return { status: "success", data: resData };
}
