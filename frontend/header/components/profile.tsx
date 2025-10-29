"use client";

import { useUserContext } from "@/tasks/contexts/user-context";

export default function Profile() {
	const user = useUserContext();
	return (
		<button className="bg-foreground rounded-full size-10 text-white font-semibold">
			{user?.name
				.split(" ")
				.map((n) => n[0])
				.join("")}
		</button>
	);
}
