"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/tasks/contexts/user-context";

export default function Profile() {
	const user = useUserContext();
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="bg-foreground rounded-full size-10 text-white font-semibold">
						{user?.name
							.split(" ")
							.map((n) => n[0])
							.join("")}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="rounded-2xl">
					<DropdownMenuItem className="flex flex-col items-start gap-1">
						<p className="text-sm font-medium">{user?.name}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="flex flex-col items-start">View Profile</DropdownMenuItem>
					<DropdownMenuItem className="flex flex-col items-start">Settings</DropdownMenuItem>
					<DropdownMenuItem className="flex flex-col items-start"> Log Out</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
