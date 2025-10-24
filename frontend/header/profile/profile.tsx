import ProfileClient from "./profile-client";
import { cookies } from "next/headers";

export default async function Profile() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token_tasks");
	if (!token) return;

	const res = await fetch("http://localhost:3222/user", {
		method: "GET",
		headers: { Cookie: `token_tasks=${token.value}` },
	});
	const data = await res.json();

	return <ProfileClient data={data} />;
}
