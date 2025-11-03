import { cookies } from "next/headers";

export async function fetchTasks() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token_tasks");

	try {
		const res = await fetch("http://localhost:3222/tasks", {
			method: "GET",
			headers: { Cookie: `token_tasks=${token?.value}` },
		});

		const resData = await res.json();

		if (res.status === 401 || res.status === 403) {
			if (resData?.error === "Session expired") {
				return { status: "expired" };
			}
			return { status: "unauthorized" };
		}
		if (!res.ok) {
			return { status: "failed", error: "Failed to fetch task" };
		}
		return { status: "success", data: resData || [] };
	} catch (error) {
		console.error(error);
	}
}
