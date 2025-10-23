import { cookies } from "next/headers";

export async function fetchTasks() {
	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	const res = await fetch("http://localhost:3222", {
		method: "GET",
		headers: { Cookie: cookieHeader },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch tasks");
	}

	return res.json();
}
