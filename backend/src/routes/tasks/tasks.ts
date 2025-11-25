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
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
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
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
});

router.post("/log-out", (req, res) => {
	const { id } = req.body;

	res.clearCookie(`token_tasks_${id}`, { httpOnly: true, sameSite: "lax", path: "/" });

	res.json({ status: "success" });
});
type AuthenticatedRequest = Request & {
	userId?: string;
};

router.get("/user", middleware, async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) return res.status(401).json({ status: "failed", error: "No id available" });

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
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
});

router.get("/tasks", middleware, async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (!req.userId) return res.status(401).json({ status: "failed", error: "No id available" });

		const userTasks = db.select().from(tasks).where(eq(tasks.userId, req.userId)).all();
		return res.status(200).json(userTasks || []);
	} catch (error) {
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
});

router.post("/tasks", middleware, async (req: AuthenticatedRequest, res: Response) => {
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
	} catch (error) {
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
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
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
});

router.put("/:taskId", middleware, async (req: AuthenticatedRequest, res: Response) => {
	const { taskId } = req.params;
	if (!taskId) return res.status(400).json({ message: "Id is missing" });
	try {
		if (!req.userId) {
			return res.status(401).json({ status: "failed", error: "No id available" });
		}

		const { data, completed } = req.body;

		const updateData: Record<string, string> = {};

		if (data) {
			const { taskName, taskDescription, taskStatus, taskPriority, taskStartDate, taskDueDate } =
				data;
			if (taskName !== undefined) updateData.taskName = taskName;
			if (taskDescription !== undefined) updateData.taskDescription = taskDescription;
			if (taskStatus !== undefined) updateData.taskStatus = taskStatus;
			if (taskPriority !== undefined) updateData.taskPriority = taskPriority;
			if (taskStartDate !== undefined) updateData.taskStartDate = taskStartDate;
			if (taskDueDate !== undefined) updateData.taskDueDate = taskDueDate;
		}
		if (completed) {
			updateData.taskStatus = completed;
		}

		if (Object.keys(updateData).length === 0)
			return res.status(400).json({ error: "No valid fields to update" });
		const updated = await db
			.update(tasks)
			.set(updateData)
			.where(and(eq(tasks.userId, req.userId), eq(tasks.taskId, taskId)))
			.returning();
		if (updated.length === 0) return res.status(404).json({ message: "Task not found" });

		return res.status(200).json({ message: "Task updated successfully", todo: updated });
	} catch (error) {
		res.status(500).json({
			status: "failed",
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
});

export default router;
