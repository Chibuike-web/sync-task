"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/tasks/contexts/user-context";
import { useTransition } from "react";

export default function Profile() {
	const user = useUserContext();
	const [pending, startTransition] = useTransition();

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
				<DropdownMenuContent align="end" className="rounded-[12px]">
					<DropdownMenuItem className="flex flex-col items-start gap-1">
						<p className="text-sm font-medium">{user?.name}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="flex flex-col items-start">View Profile</DropdownMenuItem>
					<DropdownMenuItem className="flex flex-col items-start">Settings</DropdownMenuItem>
					<DropdownMenuItem
						disabled={pending}
						className="flex flex-col items-start"
						onClick={() => {
							startTransition(async () => {
								try {
									await fetch("http://localhost:3222/log-out", {
										method: "POST",
										credentials: "include",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify({ id: user.id }),
									});
								} catch (error) {
									console.error(error);
								}
								window.location.href = "/sign-in";
							});
						}}
					>
						{pending ? "Logging out..." : "Log Out"}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
