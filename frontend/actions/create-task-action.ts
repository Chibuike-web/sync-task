"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTaskAction(data: any) {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	const res = await fetch("http://localhost:3222", {
		method: "POST",
		headers: { "Content-Type": "application/json", Cookie: cookieHeader },
		credentials: "include",
		body: JSON.stringify(data),
	});
	const resData = await res.json();

	if (!res.ok) {
		return { success: false, error: resData.error || "Failed to create task" };
	}
	revalidatePath("/");

	return { success: true, data: resData };
}
