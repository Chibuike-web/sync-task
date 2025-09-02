import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import { UserType } from "../schemas/userSchema";
import { v4 as uuidv4 } from "uuid";
import { authSchema } from "../schemas/authSchema";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let users: UserType[] = [];

// Sign up
app.post("/signup", async (req, res) => {
	const input = req.body;
	const parsed = authSchema.safeParse(input);
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid input" });
	}
	const { email, password } = parsed.data;

	const user = users.find((u) => u.email === email);

	if (user) return res.status(409).json({ message: "User already exist. log in instead" });

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const newUser = {
		id: uuidv4(),
		email,
		password: hashedPassword,
		todos: [],
	};
	users.push(newUser);
	console.log(newUser);
	console.log(users);
	return res.status(200).json({ message: "User successfully registered" });
});

// Sign in
app.post("/login", async (req, res) => {
	const input = req.body;
	const parsed = authSchema.safeParse(input);
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid input" });
	}
	const { email, password } = parsed.data;
	const user = users.find((u) => u.email === email);
	console.log(user);

	if (!user) return res.status(404).json({ message: "User doesn't exist. sign up instead" });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(401).json({ message: "Wrong password" });
	return res.status(200).json({ message: "User successfully authenticated", user: user });
});

// Add todo
app.post("/add-todo", async (req, res) => {
	const { userId, title } = req.body;
	if (!title) return res.status(400).json({ message: "Missing input" });
	const user = users.find((u) => u.id === userId);
	if (!user) return res.status(404).json({ message: "User not found" });

	const newTodo = {
		id: uuidv4(),
		title: title,
	};

	if (!user.todos) user.todos = [];
	user.todos.push(newTodo);

	return res.status(200).json({ message: "Todo saved", todo: newTodo, user: user });
});

// Delete todo
app.delete("/delete-todo", async (req, res) => {
	const { userId, todoId } = req.body;
	if (!userId) return res.status(400).json({ message: "User Id is required" });

	if (!todoId) return res.status(400).json({ error: "Todo Id is required" });

	const user = users.find((u) => u.id === userId);

	if (!user) return res.status(400).json({ error: "User not found" });
	const todoExist = user.todos?.some((t) => t.id === todoId);

	if (!todoExist) {
		return res.status(404).json({ error: "Todo not found" });
	}
	const updatedUser = { ...user, todos: user?.todos?.filter((t) => t.id !== todoId) };
	const userIndex = users.findIndex((u) => u.id === userId);
	users[userIndex] = updatedUser;

	return res.status(200).json({ message: "Todo deleted successfully", user: updatedUser });
});

app.listen(3222, () => {
	console.log("Server running at http://localhost:3222");
});
