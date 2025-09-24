"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthGuard() {
	const router = useRouter();
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/todos/login");
			return;
		}

		try {
			const [, payload] = token.split(".");
			const decoded = JSON.parse(atob(payload));
			const isExpired = decoded.exp * 1000 < Date.now();

			if (isExpired) {
				localStorage.removeItem("token");
				router.push("/todos/login");
				return;
			}
			setReady(true);
		} catch (err) {
			console.error("Invalid token", err);
			localStorage.removeItem("token");
			router.push("/todos/login");
			return;
		} finally {
			setReady(true);
		}
	}, [router]);

	return ready;
}
