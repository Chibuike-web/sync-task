import { NextFunction, Request, Response, Router } from "express";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SignJWT, jwtVerify } from "jose";
import { authSchema } from "../../schemas/todos/authSchema";
import { db } from "../../todos/lib/index";
import { todos } from "../../todos/lib/schema";
import { and, eq } from "drizzle-orm";
import { users } from "../../todos/lib/schema";

const router = Router();

router.post("/signup", async (req, res) => {
	try {
		const input = req.body;
		const parsed = authSchema.safeParse(input);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input" });
		}

		const { email, password } = parsed.data;
		const existingUser = db.select().from(users).where(eq(users.email, email)).get();
		if (existingUser) return res.status(409).json({ error: "User already exist. Log in instead" });

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		db.insert(users)
			.values({
				email,
				password: hashedPassword,
			})
			.run();

		return res.status(200).json({ message: "User successfully registered" });
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
});

router.post("/login", async (req, res) => {
	try {
		const parsed = authSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input" });
		}

		const { email, password } = parsed.data;
		const existingUser = db.select().from(users).where(eq(users.email, email)).get();
		if (!existingUser)
			return res.status(404).json({ error: "User doesn't exist. Sign up instead" });

		const isMatch = await bcrypt.compare(password, existingUser.password);
		if (!isMatch) return res.status(401).json({ error: "Wrong password" });

		const token = await new SignJWT({ userId: existingUser.id })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(JWT_SECRET);

		const userTodos = db.select().from(todos).where(eq(todos.userId, existingUser.id)).all();

		return res.status(200).json({
			message: "User successfully authenticated",
			token,
			todos: userTodos || [],
		});
	} catch (err) {
		console.error("Login failed:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/", authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
	try {
		const userTodos = db
			.select()
			.from(todos)
			.where(eq(todos.userId, Number(req.userId)))
			.all();

		return res.status(200).json(userTodos);
	} catch (error) {
		console.error("Error fetching todos:", error);
		res.status(500).json({ error: "Failed to fetch todos" });
	}
});

router.post("/", authMiddleware, async (req: Request & { userId?: string }, res: Response) => {
	try {
		const { title } = req.body;
		if (!title) return res.status(400).json({ message: "Title is required" });

		const userTodos = db
			.select()
			.from(todos)
			.where(eq(todos.userId, Number(req.userId)))
			.all();

		if (!userTodos) return res.status(404).json({ message: "User not found" });

		const newTodo = {
			id: uuidv4(),
			title,
			userId: Number(req.userId),
		};
		db.insert(todos).values(newTodo).run();

		return res.status(200).json({ message: "Todo saved", todo: newTodo });
	} catch (error) {
		console.error(error);
	}
});

router.delete(
	"/:todoId",
	authMiddleware,
	async (req: Request & { userId?: string }, res: Response) => {
		const todoId = req.params.todoId;
		if (!todoId.trim()) return res.status(400).json({ error: "Todo Id is required" });

		try {
			const deleted = await db
				.delete(todos)
				.where(and(eq(todos.userId, Number(req.userId)), eq(todos.id, todoId)))
				.returning();

			if (deleted.length === 0) {
				return res.status(404).json({ message: "Todo not found" });
			}

			return res.status(200).json({ message: "Todo deleted successfully", todo: deleted });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Failed to delete todo" });
		}
	}
);

router.put(
	"/:todoId",
	authMiddleware,
	async (req: Request & { userId?: string }, res: Response) => {
		try {
			const todoId = req.params.todoId;
			if (!todoId.trim()) return res.status(400).json({ error: "Todo Id is required" });
			const { content } = req.body;
			if (!content.trim()) return res.status(400).json({ error: "Content is required" });

			const edited = await db
				.update(todos)
				.set({ title: content })
				.where(and(eq(todos.userId, Number(req.userId)), eq(todos.id, todoId)))
				.returning();

			if (edited.length === 0) {
				return res.status(404).json({ error: "Todo not found" });
			}
			return res.status(200).json({ message: "Todo updated", todo: edited[0] });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: "Failed to update todo" });
		}
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
