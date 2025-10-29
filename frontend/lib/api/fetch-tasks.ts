import { cookies } from "next/headers";

export async function fetchTasks() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token_tasks");

	try {
		const res = await fetch("http://localhost:3222/tasks", {
			method: "GET",
			headers: { Cookie: `token_tasks=${token?.value}` },
			cache: "force-cache",
		});

		if (res.status === 401 || res.status === 403) {
			return { status: "unauthorized" };
		}
		if (!res.ok) {
			return { status: "failed", error: "Failed to fetch task" };
		}
		const data = await res.json();
		return { status: "success", data: data || [] };
	} catch (error) {
		console.error(error);
	}
}
