"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { UserType } from "./schemas/userSchema";
import { TodoType } from "./schemas/todoSchema";

export default function Home() {
	const [input, setInput] = useState("");
	const [user, setUser] = useState<UserType | null>(null);

	const router = useRouter();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (!storedUser) {
			router.push("/signup");
			return;
		}
		const parsedUser = JSON.parse(storedUser);
		if (!parsedUser) return;

		setUser(parsedUser);
	}, []);

	useLayoutEffect(() => {
		if (user) localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	const handleAddTodo = async () => {
		if (!user || !input.trim()) return;

		const newTodo: TodoType = {
			id: crypto.randomUUID(),
			title: input.trim(),
		};

		try {
			const res = await fetch("http://localhost:3222/add-todo", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user.id, title: input.trim() }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				if (res.status === 400) {
					console.log(errorData.message);
					return;
				} else if (res.status === 404) {
					console.log(errorData.message);
					return;
				}
				return;
			}
			const data = await res.json();
			setUser(data.user);
			setInput("");
		} catch (err) {
			console.log(err);
			setUser({ ...user, todos: user.todos?.filter((t) => t.id !== newTodo.id) });
		}
	};

	const handleDelete = async (id: string) => {
		if (!user) return;
		const updatedTodos = user.todos?.filter((t) => t.id !== id);
		setUser({ ...user, todos: updatedTodos });
		try {
			const res = await fetch("http://localhost:3222/delete-todo", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user.id, todoId: id }),
			});
			if (!res.ok) {
				const errorData = await res.json();
				if (res.status === 400) {
					console.log(errorData.message);
					return;
				} else if (res.status === 404) {
					console.log(errorData.message);
					return;
				}
				return;
			}
			const data = await res.json();
			setUser(data.user);
		} catch (err) {
			console.error(err);
		}
	};

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
					{user?.todos &&
						user?.todos.map((todo) => (
							<li key={todo.id} className="flex items-center justify-between pb-4">
								<span>{todo.title}</span>
								<div className="flex gap-2">
									<Button variant="outline">Edit</Button>
									<Button variant="destructive" onClick={() => handleDelete(todo.id)}>
										Delete
									</Button>
								</div>
							</li>
						))}
				</ul>
			</section>
		</main>
	);
}
