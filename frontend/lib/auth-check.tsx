import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthCheck({ children }: { children: React.ReactNode }) {
	const cookieStore = await cookies();
	const token = cookieStore.get("token_tasks");
	if (!token) redirect("/sign-in");

	try {
		const res = await fetch("http://localhost:3222/user", {
			method: "GET",
			headers: { Cookie: `token_tasks=${token.value}` },
		});
		if (!res.ok) {
			const data = await res.json();
			if (data.redirect === "/sign-up") redirect("/sign-up");
		}
	} catch (error) {
		console.error(error);
		redirect("/sign-up");
	}
	return <>{children}</>;
}
