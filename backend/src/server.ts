import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SignJWT, jwtVerify } from "jose";
import { UserType } from "../schemas/userSchema";
import { authSchema } from "../schemas/authSchema";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
let users: UserType[] = [];

app.post("/signup", async (req, res) => {
	const input = req.body;
	const parsed = authSchema.safeParse(input);
	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid input" });
	}
	const { email, password } = parsed.data;

	const user = users.find((u) => u.email === email);

	if (user) return res.status(409).json({ error: "User already exist. log in instead" });

	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	const newUser = {
		id: uuidv4(),
		email,
		password: hashedPassword,
		todos: [],
	};
	users.push(newUser);
	return res.status(200).json({ message: "User successfully registered" });
});

app.post("/login", async (req, res) => {
	const input = req.body;
	const parsed = authSchema.safeParse(input);
	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid input" });
	}
	const { email, password } = parsed.data;
	const user = users.find((u) => u.email === email);

	if (!user) return res.status(404).json({ error: "User doesn't exist. sign up instead" });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(401).json({ error: "Wrong password" });

	const token = await new SignJWT({ userId: user.id })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("1h")
		.sign(JWT_SECRET);
	return res
		.status(200)
		.json({ message: "User successfully authenticated", token, todos: user.todos });
});

app.post("/todos", authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
	const { title } = req.body;
	if (!title) return res.status(400).json({ message: "Missing input" });

	const user = users.find((u) => u.id === req.userId);
	if (!user) return res.status(404).json({ message: "User not found" });

	const newTodo = {
		id: uuidv4(),
		title: title,
	};

	if (!user.todos) user.todos = [];
	user.todos.push(newTodo);

	return res.status(200).json({ message: "Todo saved", todo: newTodo });
});

app.delete(
	"/todos/:todoId",
	authMiddleware,
	async (req: Request & { userId?: string }, res: Response) => {
		const todoId = req.params.todoId;

		if (!todoId.trim()) return res.status(400).json({ error: "Todo Id is required" });

		const user = users.find((u) => u.id === req.userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const todoExist = user.todos?.some((t) => t.id === todoId);
		if (!todoExist) {
			return res.status(404).json({ error: "Todo not found" });
		}

		user.todos = user.todos?.filter((t) => t.id !== todoId) || [];

		return res.status(200).json({ message: "Todo deleted successfully", todos: user.todos });
	}
);

app.listen(3222, () => {
	console.log("Server running at http://localhost:3222");
});

async function authMiddleware(
	req: Request & { userId?: string },
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: "Missing token" });

	const token = authHeader.split(" ")[1];
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		req.userId = payload.userId as string;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
