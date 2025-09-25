"use client";

import { Fragment, Suspense, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TodoType } from "@/lib/schemas/todoSchema";
import { useAuthGuard } from "./hooks/useAuth";
import useSWR from "swr";

export default function Todos() {
	const ready = useAuthGuard();

	if (!ready) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-center mt-10">Checking authentication…</p>
			</div>
		);
	}

	return (
		<>
			<header className="flex items-center justify-between max-w-[800px] mx-auto p-6 xl:px-0">
				<h1>Chibuike</h1>
				<Button variant="outline">Sign out</Button>
			</header>
			<Suspense fallback={<p className="text-center mt-10">Loading todos…</p>}>
				<TodoList />
			</Suspense>
		</>
	);
}

const TodoList = () => {
	const [input, setInput] = useState("");
	const [todos, setTodos] = useState<TodoType[]>([]);
	const [editId, setEditId] = useState("");
	const [editContent, setEditContent] = useState("");
	const router = useRouter();

	const { data, error, mutate } = useSWR<TodoType[]>("http://localhost:3222/todos");

	const handleAdd = async () => {
		if (!input.trim()) return;

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}

			const newTodo = { id: crypto.randomUUID(), title: input.trim() };

			await mutate(
				async (currentTodos = []) => {
					const res = await fetch("http://localhost:3222/todos", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ title: input.trim() }),
					});

					if (!res.ok) throw new Error("Failed to add todo");
					const data = await res.json();
					return [...currentTodos, data.todo];
				},
				{
					optimisticData: (currentTodos = []) => [...currentTodos, newTodo],
					rollbackOnError: true,
					revalidate: false,
				}
			);

			setInput("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (todoId: string) => {
		if (!todoId) return;

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}

			await mutate(
				async (currentTodos = []) => {
					const res = await fetch(`http://localhost:3222/todos/${todoId}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});
					if (!res.ok) throw new Error("Failed to delete todo");
					return currentTodos.filter((t) => t.id !== todoId);
				},
				{
					optimisticData: (currentTodos = []) => currentTodos.filter((t) => t.id !== todoId),
					rollbackOnError: true,
					revalidate: false,
				}
			);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSave = async (todoId: string) => {
		if (!editContent.trim()) return;

		const token = localStorage.getItem("token");
		if (!token) {
			router.push("/login");
			return;
		}

		await mutate(
			async (currentTodos = []) => {
				const res = await fetch(`http://localhost:3222/todos/${todoId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ content: editContent }),
				});
				if (!res.ok) throw new Error("Failed to edit todo");
				return currentTodos.map((t) => (t.id === todoId ? { ...t, title: editContent } : t));
			},

			{
				optimisticData: (currentTodos = []) =>
					currentTodos.map((t) => (t.id === todoId ? { ...t, title: editContent } : t)),
				rollbackOnError: true,
				revalidate: false,
			}
		);
		setEditId("");
	};

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editId && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editId]);

	if (error) {
		return <p>Issue fetching todos</p>;
	}

	return (
		<main className="flex flex-col mt-10 items-center px-6 xl:px-0 max-w-[600px] mx-auto">
			<div className="flex items-center w-full justify-between gap-2 mb-6">
				<Input
					type="text"
					placeholder="Add a todo..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<Button type="button" onClick={handleAdd}>
					Add
				</Button>
			</div>

			<ul className="flex flex-col gap-4 w-full">
				{data?.map((todo: TodoType) => (
					<Fragment key={todo.id}>
						{editId === todo.id ? (
							<div className="flex items-center gap-2 pb-4">
								<Input
									type="text"
									ref={inputRef}
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
								/>
								<Button type="button" onClick={() => handleSave(todo.id)}>
									Save
								</Button>
								<Button type="button" variant="outline" onClick={() => setEditId("")}>
									Cancel
								</Button>
							</div>
						) : (
							<li
								key={todo.id}
								className="flex flex-col gap-y-4 w-full sm:flex-row sm:items-center justify-between p-4 border border-foreground/10 rounded-2xl"
							>
								<span>{todo.title}</span>
								<div className="flex gap-2 w-full sm:w-max">
									<Button
										variant="outline"
										className="flex-1 w-full sm:w-max"
										onClick={() => {
											setEditId(todo.id);
											setEditContent(todo.title);
										}}
									>
										Edit
									</Button>
									<Button
										variant="destructive"
										className="flex-1 w-full sm:w-max"
										onClick={() => handleDelete(todo.id)}
									>
										Delete
									</Button>
								</div>
							</li>
						)}
					</Fragment>
				))}
			</ul>
		</main>
	);
};
