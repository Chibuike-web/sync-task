"use client";

import { Bell, Plus, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function TasksClient() {
	return (
		<div>
			<header className="py-6 border-b border-sidebar-border">
				<nav className="flex items-center justify-between max-w-[900px] mx-auto">
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
			<main className="flex items-center justify-between max-w-[900px] mx-auto mt-10">
				<Tabs defaultValue="all">
					<TabsList>
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="ongoing">Ongoing</TabsTrigger>
						<TabsTrigger value="completed">Completed</TabsTrigger>
					</TabsList>
					<TabsContent value="all">
						<AllTasks />
					</TabsContent>
					<TabsContent value="ongoing">
						<OngoingTasks />
					</TabsContent>
					<TabsContent value="completed">
						<CompletedTasks />
					</TabsContent>
				</Tabs>
			</main>
		</div>
	);
}

const AllTasks = () => {
	return <div>All Tasks</div>;
};

const OngoingTasks = () => {
	return <div>In Progress</div>;
};

const CompletedTasks = () => {
	return <div>Completed</div>;
};
