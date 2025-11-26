import { cacheLife } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchUser = async (id?: string) => {
	if (!id) redirect("/sign-in");

	const cookieStore = await cookies();
	const cookieName = `token_tasks_${id}`;

	const cookie = cookieStore.get(cookieName);
	if (!cookie) return redirect("/sign-in");
	return cachedUser(cookieName, cookie);
};

async function cachedUser(cookieName: string, cookie: { value: string }) {
	"use cache";
	cacheLife("minutes");
	const res = await fetch("http://localhost:3222/user", {
		method: "GET",
		headers: { Cookie: `${cookieName}=${cookie.value}` },
	});

	if (!res.ok) return null;

	return res.json();
}
