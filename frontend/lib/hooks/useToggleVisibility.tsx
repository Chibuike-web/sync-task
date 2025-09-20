"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useToggleVisibility = () => {
	const [toggleVisibility, setToggleVisibility] = useState(false);
	const handleToggleVisibility = () => {
		setToggleVisibility((prev) => !prev);
	};

	return {
		toggleVisibility,
		handleToggleVisibility,
	};
};

export function useAuthGuard() {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		try {
			const [, payload] = token.split(".");
			const decoded = JSON.parse(atob(payload));
			const isExpired = decoded.exp * 1000 < Date.now();

			if (isExpired) {
				localStorage.removeItem("token");
				router.push("/login");
			}
		} catch (err) {
			console.error("Invalid token", err);
			localStorage.removeItem("token");
			router.push("/login");
		}
	}, [router]);
}
