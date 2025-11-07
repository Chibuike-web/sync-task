import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchTasks(id?: string) {
	if (!id) return redirect("/sign-in");

	const cookieStore = await cookies();
	const cookieName = `token_tasks_${id}`;

	const cookie = cookieStore.get(cookieName);
	if (!cookie) return redirect("/sign-in");

	try {
		const res = await fetch("http://localhost:3222/tasks", {
			method: "GET",
			headers: { Cookie: `${cookieName}=${cookie.value}` },
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
