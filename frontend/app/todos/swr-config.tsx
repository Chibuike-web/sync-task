"use client";

import { SWRConfig } from "swr";

export default function SWRProvider({ children }: { children: React.ReactNode }) {
	return (
		<SWRConfig
			value={{
				fetcher: async (url: string) => {
					const res = await fetch(url, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
						},
					});

					if (!res.ok) throw new Error("Failed to fetch");
					return res.json();
				},
				suspense: true,
				fallback: {
					"http://localhost:3222/todos": [],
				},
			}}
		>
			{children}
		</SWRConfig>
	);
}
