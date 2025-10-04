"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function authFetch() {
	const res = await fetch("http://localhost:3222/todos", {
		method: "GET",
		credentials: "include",
	});
	if (!res.ok) throw new Error("Not authenticated");
	return res.json();
}

export function useAuthGuard() {
	const router = useRouter();
	const [ready, setReady] = useState(false);

	useEffect(() => {
		authFetch()
			.then(() => setReady(true))
			.catch(() => {
				router.push("/todos/login");
			});
	}, [router]);

	return ready;
}
