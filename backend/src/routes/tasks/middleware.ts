import { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../../config";

export async function middleware(
	req: Request & { userId?: string },
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.cookies.token_tasks;
		if (!token) return res.status(401).json({ message: "No token" });

		const { payload } = await jwtVerify(token, JWT_SECRET);
		req.userId = payload.userId as string;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
