import { Suspense } from "react";
import Tasks from "@/tasks/tasks";
import Header from "@/header/header";
import AuthCheck from "@/lib/auth-check";

export default async function Home() {
	return (
		<Suspense
			fallback={<div className="min-h-screen grid place-items-center">Authenticating...</div>}
		>
			<AuthCheck>
				<Suspense>
					<Header />
				</Suspense>
				<Suspense
					fallback={<div className="min-h-screen grid place-items-center">Loading tasks...</div>}
				>
					<Tasks />
				</Suspense>
			</AuthCheck>
		</Suspense>
	);
}
