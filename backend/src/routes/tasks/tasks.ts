import { Request, Response, Router } from "express";
import { JWT_SECRET } from "../../config";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SignJWT } from "jose";
import { authSchema } from "../../../schemas/auth-schema";
import { db } from "../../../tasks/lib/index";
import { and, eq } from "drizzle-orm";
import { middleware } from "./middleware";
import { users } from "../../../tasks/lib/schema";

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

		const token = await new SignJWT({ userId: existingUser.id })
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1h")
			.sign(JWT_SECRET);

		res.cookie("token_tasks", token, { httpOnly: true, secure: true, sameSite: "lax" });
		res.json({ message: "Signed in successfully" });
	} catch (error) {
		console.error("Sign in failed:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/", middleware, async (req: Request & { userId?: string }, res: Response) => {});

router.post("/", middleware, async (req: Request & { userId?: string }, res: Response) => {});

router.delete(
	"/:taskId",
	middleware,
	async (req: Request & { userId?: string }, res: Response) => {}
);

router.put("/:taskId", middleware, async (req: Request & { userId?: string }, res: Response) => {});

export default router;
