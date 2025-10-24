import { cookies } from "next/headers";

export async function fetchTasks() {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	try {
		const res = await fetch("http://localhost:3222/tasks", {
			method: "GET",
			headers: { Cookie: cookieHeader },
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
