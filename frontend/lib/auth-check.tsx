import UserProvider from "@/tasks/contexts/user-context";
import { redirect } from "next/navigation";
import { fetchUser } from "./api/fetch-user";

export default async function AuthCheck({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { userId: string };
}) {
	const { userId } = await params;

	const user = await fetchUser(userId);
	if (!user) redirect("/sign-in");

	return <UserProvider user={user}>{children}</UserProvider>;
}
