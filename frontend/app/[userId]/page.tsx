import { Suspense } from "react";
import Header from "@/header/header";
import AuthCheck from "@/lib/auth-check";
import Tasks from "@/tasks/tasks";
import TasksClient from "@/tasks/tasks-client";

export default async function Home({ params }: { params: { userId: string } }) {
	return (
		<Suspense
			fallback={<div className="min-h-screen grid place-items-center">Authenticating...</div>}
		>
			<AuthCheck params={params}>
				<Header />
				<main className="flex flex-col items-start gap-y-6 max-w-[700px] mx-auto mt-10 px-6 xl:px-0">
					<Suspense fallback={<TasksLoadingSkeleton />}>
						<Tasks params={params}>
							<TasksClient />
						</Tasks>
					</Suspense>
				</main>
			</AuthCheck>
		</Suspense>
	);
}

function TasksLoadingSkeleton() {
	return (
		<>
			<div className="h-10 w-32 bg-gray-200 rounded-[10px] animate-pulse" />
			<div className="w-full space-y-4">
				<div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
				<div className="h-32 w-full bg-gray-100 rounded-xl animate-pulse" />
				<div className="h-32 w-full bg-gray-100 rounded-xl animate-pulse" />
				<div className="h-32 w-full bg-gray-100 rounded-xl animate-pulse" />
			</div>
		</>
	);
}
