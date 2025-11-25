import UserProvider from "@/tasks/contexts/user-context";
import { redirect } from "next/navigation";
import { fetchUser } from "../../lib/api/fetch-user";
import { Suspense } from "react";

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { userId: string };
}) {
	return (
		<Suspense
			fallback={<div className="min-h-screen grid place-items-center">Authenticating...</div>}
		>
			<Main params={params}>{children}</Main>
		</Suspense>
	);
}

async function Main({
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
