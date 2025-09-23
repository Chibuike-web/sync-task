import { NextFunction, Request, Response, Router } from "express";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SignJWT, jwtVerify } from "jose";
import { authSchema, type UserType } from "../../schemas/todos/authSchema";
import { TodoGroup } from "../../schemas/todos/todoSchema";

const router = Router();

let users: UserType[] = [];
let usersTodos: TodoGroup[] = [];

router.post("/signup", async (req, res) => {
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
	};

	users.push(newUser);

	usersTodos.push({ userId: newUser.id, todos: [] });
	return res.status(200).json({ message: "User successfully registered" });
});

router.post("/login", async (req, res) => {
	try {
		const parsed = authSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input" });
		}

		const { email, password } = parsed.data;
		const user = users.find((u) => u.email === email);
		if (!user) return res.status(404).json({ error: "User doesn't exist. Sign up instead" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ error: "Wrong password" });

		const token = await new SignJWT({ userId: user.id })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(JWT_SECRET);

		const userTodos = usersTodos.find((u) => u.userId === user.id);

		return res.status(200).json({
			message: "User successfully authenticated",
			token,
			todos: userTodos?.todos || [],
		});
	} catch (err) {
		console.error("Login failed:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/", authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
	const { title } = req.body;
	if (!title) return res.status(400).json({ message: "Title is required" });

	const userTodos = usersTodos.find((u) => u.userId === req.userId);
	if (!userTodos) return res.status(404).json({ message: "User not found" });

	const newTodo = { id: uuidv4(), title };
	userTodos.todos.push(newTodo);

	return res.status(200).json({ message: "Todo saved", todo: newTodo });
});

router.delete(
	"/:todoId",
	authMiddleware,
	async (req: Request & { userId?: string }, res: Response) => {
		const todoId = req.params.todoId;
		if (!todoId.trim()) return res.status(400).json({ error: "Todo Id is required" });

		const userTodos = usersTodos.find((u) => u.userId === req.userId);
		if (!userTodos) return res.status(404).json({ error: "User not found" });

		const todoExist = userTodos.todos?.some((t) => t.id === todoId);
		if (!todoExist) {
			return res.status(404).json({ error: "Todo not found" });
		}

		userTodos.todos = userTodos.todos?.filter((t) => t.id !== todoId) || [];

		return res.status(200).json({ message: "Todo deleted successfully", todos: userTodos.todos });
	}
);

export default router;

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
