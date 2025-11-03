import { NextFunction, Request, Response } from "express";
import { db } from "../../../tasks/lib";
import { users } from "../../../tasks/lib/schema";
import { eq } from "drizzle-orm";
import { verifySessionToken } from "../lib/session";

export async function middleware(
	req: Request & { userId?: string },
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.cookies.token_tasks;
		if (!token) return res.status(401).json({ message: "No token" });

		const payload = await verifySessionToken(token);
		const userId = payload.userId as number;

		const user = db.select().from(users).where(eq(users.id, userId)).get();
		if (!user) {
			res.clearCookie("token_tasks");
			return res.status(404).json({ error: "User not found", redirect: "/sign-up" });
		}

		req.userId = userId.toString();
		next();
	} catch (error) {
		const err = error as { code?: string };
		if (err.code === "ERR_JWT_EXPIRED") {
			console.error("Session expired");
			return res.status(401).json({ error: "Session expired" });
		}
		res.clearCookie("token_tasks");
		return res.status(401).json({ error: "Invalid or expired token", redirect: "/sign-in" });
	}
}
