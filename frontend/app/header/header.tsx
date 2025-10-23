import { Suspense } from "react";
import HeaderClient from "./header-client";

export default async function Header() {
	return (
		<header className="py-6 border-b border-sidebar-border">
			<nav className="flex items-center justify-between max-w-[700px] mx-auto px-6 xl:px-0">
				<h1 className="tracking-[-0.05em] text-[20px] font-bold">SyncTask</h1>
				<Suspense fallback={<div className="h-16" />}>
					<HeaderClient />
				</Suspense>
			</nav>
		</header>
	);
}
