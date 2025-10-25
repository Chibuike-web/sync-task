"use client";

import Notification from "./components/notification";
import SearchBar from "./components/search-bar";
import { useEffect, useState } from "react";

type UserType = {
	name: string;
	email: string;
};

export default function Header() {
	const [user, setUser] = useState<UserType | null>(null);
	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		const fetchUser = async () => {
			try {
				const res = await fetch("http://localhost:3222/user", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					signal,
				});
				if (!res.ok) return;

				const data = await res.json();
				setUser(data);
			} catch (error) {
				if (error instanceof Error && error.name !== "AbortError") {
					console.error("Fetch failed:", error);
				}
			}
		};
		fetchUser();
	}, []);
	return (
		<header className="py-6 border-b border-sidebar-border">
			<nav className="flex items-center justify-between max-w-[700px] mx-auto px-6 xl:px-0">
				<h1 className="tracking-[-0.05em] text-[20px] font-bold">SyncTask</h1>
				<div className="flex gap-6 items-center">
					<div className="flex items-center gap-2">
						<SearchBar />
						<Notification />
					</div>
					<button className="bg-foreground rounded-full size-10 text-white font-semibold">
						{user?.name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</button>
				</div>
			</nav>
		</header>
	);
}
