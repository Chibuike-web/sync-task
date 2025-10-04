"use client";

import { SWRConfig } from "swr";

export default function SWRProvider({ children }: { children: React.ReactNode }) {
	return (
		<SWRConfig
			value={{
				fetcher: async (url: string) => {
					const res = await fetch(url, {
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (!res.ok) throw new Error("Failed to fetch");
					const data = await res.json();
					return Array.isArray(data) ? data : [];
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
