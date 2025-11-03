"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteTaskAction(id: string) {
	const cookieStore = await cookies();
	const token = cookieStore.get("token_tasks");

	const res = await fetch(`http://localhost:3222/${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json", Cookie: `token_tasks=${token?.value}` },
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
