import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const fetchUser = async (id?: string) => {
	if (!id) return redirect("/sign-in");

	const cookieStore = await cookies();
	const cookieName = `token_tasks_${id}`;

	const cookie = cookieStore.get(cookieName);
	if (!cookie) return redirect("/sign-in");

	const res = await fetch("http://localhost:3222/user", {
		method: "GET",
		headers: { Cookie: `${cookieName}=${cookie.value}` },
		cache: "force-cache",
		next: { revalidate: 3600 },
	});

	if (!res.ok) return null;

	return res.json();
};
