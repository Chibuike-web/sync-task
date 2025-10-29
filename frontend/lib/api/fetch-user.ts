import { cache } from "react";
import { cookies } from "next/headers";

export const fetchUser = cache(async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("token_tasks");

	const res = await fetch("http://localhost:3222/user", {
		method: "GET",
		headers: { Cookie: `token_tasks=${token?.value}` },
		cache: "force-cache",
	});

	if (!res.ok) return null;
	return res.json();
});
