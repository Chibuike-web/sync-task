import Header from "@/header/header";
import Tasks from "@/tasks/tasks";
import TasksTabContent from "@/tasks/tasks-tabs-content";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import CreateTaskModal from "@/tasks/components/create-task-modal";
import RootLayout from "@/lib/auth-layout";
import { Suspense } from "react";
import TasksProvider from "@/tasks/contexts/tasks-context";

export default async function Home({ params }: { params: { userId: string } }) {
	return (
		<RootLayout params={params}>
			<Header />
			<main className="flex flex-col items-start gap-y-6 max-w-[700px] mx-auto mt-10 px-6 xl:px-0">
				<Dialog>
					<DialogTrigger
						id="create-task-description"
						className="text-[16px] flex gap-2 bg-foreground h-10 px-4 text-white items-center justify-center rounded-[10px]"
					>
						<Plus className="w-5 h-5" />
						<span>Create Task</span>
					</DialogTrigger>
					<TasksProvider>
						<CreateTaskModal />
					</TasksProvider>
				</Dialog>

				<Tabs defaultValue="all" className="w-full">
					<TabsList className="w-max">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="not started">Not Started</TabsTrigger>
						<TabsTrigger value="started">Started</TabsTrigger>
						<TabsTrigger value="completed">Completed</TabsTrigger>
					</TabsList>
					<Suspense fallback={<TasksLoadingSkeleton />}>
						<Tasks params={params}>
							<TasksTabContent />
						</Tasks>
					</Suspense>
				</Tabs>
			</main>
		</RootLayout>
	);
}

function TasksLoadingSkeleton() {
	return (
		<div className="w-full space-y-4">
			<div className="h-32 w-full bg-gray-100 rounded-xl animate-pulse" />
			<div className="h-32 w-full bg-gray-100 rounded-xl animate-pulse" />
			<div className="h-32 w-full bg-gray-100 rounded-xl animate-pulse" />
		</div>
	);
}
