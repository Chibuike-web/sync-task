"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "./Hooks";
import { TodoType } from "./schemas/todoSchema";

export default function Home() {
	const [input, setInput] = useState("");
	const [todos, setTodos] = useState<TodoType[]>([]);
	const [editId, setEditId] = useState("");
	const [editContent, setEditContent] = useState("");
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);

	useAuthGuard();

	useEffect(() => {
		const stored = localStorage.getItem("todos");
		if (stored) {
			try {
				setTodos(JSON.parse(stored));
			} catch {
				console.error("Invalid todos in localStorage");
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos));
	}, [todos]);

	const handleAddTodo = async () => {
		if (!input.trim()) return;

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}

			const res = await fetch("http://localhost:3222/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title: input.trim() }),
			});

			const data = await res.json();
			if (!res.ok) {
				console.error(data.error);
				return;
			}

			const newTodo = data.todo;
			setTodos((prev) => [...prev, newTodo]);

			setInput("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = async (todoId: string) => {
		if (!todoId) return;

		const prevTodos = todos;
		setTodos((prev) => prev?.filter((t) => t.id !== todoId));

		try {
			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}

			const res = await fetch(`http://localhost:3222/todos/${todoId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const data = await res.json();
			if (!res.ok) {
				console.error(data.error);
				setTodos(prevTodos);
			}
		} catch (err) {
			console.error(err);
			setTodos(prevTodos);
		}
	};

	const handleSave = async (todoId: string) => {
		console.log("Man");
		if (!editContent.trim()) return;
		console.log("Women");
		setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, title: editContent } : t)));
		setEditId("");
	};

	useEffect(() => {
		if (editId && inputRef.current) {
			inputRef.current.focus();
		}
	}, [editId]);

	return (
		<main className="flex items-center justify-center h-screen bg-gray-50 px-4">
			<section className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
				<div className="flex items-center gap-2 mb-6">
					<Input
						type="text"
						placeholder="Add a todo..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button type="button" onClick={handleAddTodo}>
						Add
					</Button>
				</div>

				<ul className="flex flex-col gap-4 divide-y-1">
					{todos?.map((todo) => (
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
								<li key={todo.id} className="flex items-center justify-between pb-4">
									<span>{todo.title}</span>
									<div className="flex gap-2">
										<Button
											variant="outline"
											onClick={() => {
												setEditId(todo.id);
												setEditContent(todo.title);
											}}
										>
											Edit
										</Button>
										<Button variant="destructive" onClick={() => handleDelete(todo.id)}>
											Delete
										</Button>
									</div>
								</li>
							)}
						</Fragment>
					))}
				</ul>
			</section>
		</main>
	);
}
