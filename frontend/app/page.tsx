import React from "react";
import TasksClient from "./TasksClient";
import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Tasks() {
	return (
		<>
			<header className="py-6 border-b border-sidebar-border">
				<nav className="flex items-center justify-between max-w-[700px] mx-auto">
					<h1 className="tracking-[-0.05em] text-[20px] font-bold">SyncTask</h1>
					<div className="flex gap-6 items-center">
						<Button className="text-[16px]" size="lg">
							<Plus className="w-5 h-5" />
							<span>Create Task</span>
						</Button>
						<div className="flex items-center gap-2">
							<button className="p-2" type="button">
								<Bell />
							</button>
							<button className="p-2" type="button">
								<Search />
							</button>
						</div>
					</div>
				</nav>
			</header>
			<TasksClient />;
		</>
	);
}
