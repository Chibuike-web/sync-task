import UserProvider from "@/tasks/contexts/user-context";
import { redirect } from "next/navigation";
import { fetchUser } from "./api/fetch-user";

export default async function AuthCheck({ children }: { children: React.ReactNode }) {
	const user = await fetchUser();
	if (!user) redirect("/sign-up");

	return <UserProvider user={user}>{children}</UserProvider>;
}
