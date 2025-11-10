import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { authSchema } from "../../../schemas/auth-schema";
import { db } from "../../../tasks/lib/index";
import { and, eq } from "drizzle-orm";
import { middleware } from "./middleware";
import { tasks, users } from "../../../tasks/lib/schema";
import { createSession } from "../lib/session";

const router = Router();

router.post("/sign-up", async (req: Request, res: Response) => {
	try {
		const parsedInput = authSchema.safeParse(req.body);
		if (!parsedInput.success) return res.status(400).json({ error: "Invalid input" });

		const { firstName, lastName, email, password } = parsedInput.data;
		const existingUser = db.select().from(users).where(eq(users.email, email)).get();
		if (existingUser) return res.status(409).json({ error: "User already exist. Log in instead" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const userId = crypto.randomUUID();
		db.insert(users)
			.values({
				id: userId,
				firstName,
				lastName,
				email,
				password: hashedPassword,
			})
			.run();

		return res.status(200).json({ message: "User successfully registered" });
	} catch (error) {
		console.error("Sign up error:", error);
		res.status(500).json({ success: false, error: "Internal server error" });
	}
});

router.post("/sign-in", async (req: Request, res: Response) => {
	try {
		const parsedInput = authSchema.safeParse(req.body);
		if (!parsedInput.success) return res.status(400).json({ error: "Invalid input" });

		const { email, password } = parsedInput.data;
		const existingUser = db.select().from(users).where(eq(users.email, email)).get();
		if (!existingUser)
			return res.status(404).json({ error: "User doesn't exist. Sign up instead" });

		const isMatch = await bcrypt.compare(password, existingUser.password);
		if (!isMatch) return res.status(401).json({ error: "Wrong password" });

		const token = await createSession(existingUser.id);

		const cookieName = `token_tasks_${existingUser.id}`;
		res.cookie(cookieName, token, { httpOnly: true, secure: true, sameSite: "lax" });
		res.json({ id: existingUser.id, message: "Signed in successfully" });
	} catch (error) {
		console.error("Sign in failed:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

type AuthenticatedRequest = Request & {
	userId?: string;
};

router.get("/user", middleware, async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ status: "failed", error: "No id available" });
		}
		const user = db.select().from(users).where(eq(users.id, req.userId)).get();
		if (!user) {
			return res.status(404).json({ status: "failed", error: "User does not exist" });
		}
		return res.status(200).json({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			id: user.id,
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

router.get("/tasks", middleware, async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) {
			return res.status(401).json({ status: "failed", error: "No id available" });
		}
		const userTasks = db.select().from(tasks).where(eq(tasks.userId, req.userId)).all();
		return res.status(200).json(userTasks || []);
	} catch (error) {
		console.error("Error fetching tasks:", error);
		res.status(500).json({ error: "Failed to fetch tasks" });
	}
});

router.post("/tasks", middleware, async (req: Request & { userId?: string }, res: Response) => {
	const { taskName, taskDescription, taskStatus, taskPriority, taskStartDate, taskDueDate } =
		req.body;
	if (
		!taskName ||
		!taskDescription ||
		!taskStatus ||
		!taskPriority ||
		!taskStartDate ||
		!taskDueDate
	) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		if (!req.userId) {
			return res.status(401).json({ status: "failed", error: "No id available" });
		}
		const newTask = db
			.insert(tasks)
			.values({
				taskId: uuidv4(),
				userId: req.userId,
				taskName,
				taskDescription,
				taskStatus,
				taskPriority,
				taskStartDate,
				taskDueDate,
			})
			.returning()
			.get();

		res.status(200).json(newTask);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to create task" });
	}
});

router.delete("/:taskId", middleware, async (req: AuthenticatedRequest, res: Response) => {
	const taskId = req.params.taskId;
	if (!taskId.trim()) return res.status(400).json({ error: "Task Id is required" });

	try {
		if (!req.userId) {
			return res.status(401).json({ status: "failed", error: "No id available" });
		}
		const deleted = await db
			.delete(tasks)
			.where(and(eq(tasks.userId, req.userId), eq(tasks.taskId, taskId)))
			.returning();
		if (deleted.length === 0) {
			return res.status(404).json({ message: "Task not found" });
		}
		return res.status(200).json({ message: "Task deleted successfully", todo: deleted });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete task" });
	}
});

router.put("/:taskId", middleware, async (req: AuthenticatedRequest, res: Response) => {});

export default router;
