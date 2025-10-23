"use client";

import { Bell, Search } from "lucide-react";

export default function HeaderClient() {
	return (
		<div className="flex gap-6 items-center">
			<div className="flex items-center gap-2">
				<button className="p-2" type="button">
					<Bell />
				</button>
				<button className="p-2" type="button">
					<Search />
				</button>
			</div>
			<button className="bg-foreground rounded-full size-10 text-white font-bold">CM</button>
		</div>
	);
}
