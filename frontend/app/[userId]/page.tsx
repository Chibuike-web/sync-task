import Header from "@/header/header";
import Tasks from "@/tasks/tasks";
import TasksTabContent from "@/tasks/tasks-tabs-content";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import CreateTaskModal from "@/tasks/components/create-task-modal";
import RootLayout from "@/components/auth/auth-layout";

export default async function Home({ params }: { params: { userId: string } }) {
	return (
		<RootLayout params={params}>
			<Header />
			<Tasks params={params}>
				<main className="flex flex-col items-start gap-y-6 max-w-[700px] mx-auto mt-10 px-6 xl:px-0">
					<Dialog>
						<DialogTrigger
							id="create-task-description"
							className="text-[16px] flex gap-2 bg-foreground h-10 px-4 text-white items-center justify-center rounded-[10px]"
						>
							<Plus className="w-5 h-5" />
							<span>Create Task</span>
						</DialogTrigger>
						<CreateTaskModal />
					</Dialog>

					<Tabs defaultValue="all" className="w-full">
						<TabsList className="w-full overflow-x-auto flex">
							<TabsTrigger value="all" className="shrink-0">
								All
							</TabsTrigger>
							<TabsTrigger value="not started" className="shrink-0">
								Not Started
							</TabsTrigger>
							<TabsTrigger value="started" className="shrink-0">
								Started
							</TabsTrigger>
							<TabsTrigger value="completed" className="shrink-0">
								Completed
							</TabsTrigger>
						</TabsList>
						<TasksTabContent />
					</Tabs>
				</main>
			</Tasks>
		</RootLayout>
	);
}

function TasksLoadingSkeleton() {
	return (
		<main className="flex flex-col items-start gap-y-6 max-w-[700px] mx-auto mt-10 px-6 xl:px-0">
			{/* Create Task Button */}
			<div className="h-10 w-32 bg-gray-200 rounded-[10px] animate-pulse" />

			{/* Tabs */}
			<div className="flex gap-3 w-full overflow-x-auto">
				<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
				<div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
				<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
				<div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
			</div>

			{/* Task Items */}
			<div className="flex flex-col gap-4 w-full">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="bg-gray-200 border rounded-xl h-[88px] p-4 w-full animate-pulse"
					/>
				))}
			</div>
		</main>
	);
}
