import { Suspense } from "react";
import Tasks from "./tasks/tasks";
import Header from "./header/header";

export default function Home() {
	return (
		<>
			<Header />
			<Suspense
				fallback={<div className="min-h-screen grid place-items-center">Loading tasks...</div>}
			>
				<Tasks />
			</Suspense>
		</>
	);
}
