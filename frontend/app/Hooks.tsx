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
		if (!token) router.push("/login");
	}, [router]);
}
