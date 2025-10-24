import { Request, Response, Router } from "express";
import { JWT_SECRET } from "../../config";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { authSchema } from "../../../schemas/auth-schema";
import { db } from "../../../tasks/lib/index";
import { eq } from "drizzle-orm";
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
		db.insert(users)
			.values({
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

		res.cookie("token_tasks", token, { httpOnly: true, secure: true, sameSite: "lax" });
		res.json({ message: "Signed in successfully" });
	} catch (error) {
		console.error("Sign in failed:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/user", middleware, async (req: Request & { userId?: string }, res: Response) => {
	try {
		const user = db
			.select()
			.from(users)
			.where(eq(users.id, Number(req.userId)))
			.get();
		if (!user) {
			res.clearCookie("token_tasks");
			return res.status(404).json({ redirect: "/sign-up" });
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

router.get("/tasks", middleware, async (req: Request & { userId?: string }, res: Response) => {
	try {
		const userTasks = db
			.select()
			.from(tasks)
			.where(eq(tasks.userId, Number(req.userId)))
			.all();
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
		const newTask = db
			.insert(tasks)
			.values({
				taskId: uuidv4(),
				userId: Number(req.userId),
				taskName,
				taskDescription,
				taskStatus,
				taskPriority,
				taskStartDate,
				taskDueDate,
			})
			.returning()
			.get();

		console.log(newTask);
		res.status(200).json(newTask);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Failed to create task" });
	}
});

router.delete(
	"/:taskId",
	middleware,
	async (req: Request & { userId?: string }, res: Response) => {}
);

router.put("/:taskId", middleware, async (req: Request & { userId?: string }, res: Response) => {});

export default router;
