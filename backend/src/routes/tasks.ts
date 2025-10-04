import { Request, Response, Router } from "express";
import { JWT_SECRET } from "../config";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { SignJWT } from "jose";
import { authSchema } from "../../schemas/todos/authSchema";
import { db } from "../../todos/lib/index";
import { and, eq } from "drizzle-orm";
import { middleware } from "./middleware";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {});

router.post("/login", async (req: Request, res: Response) => {});

router.get("/", middleware, async (req: Request & { userId?: string }, res: Response) => {});

router.post("/", middleware, async (req: Request & { userId?: string }, res: Response) => {});

router.delete(
	"/:todoId",
	middleware,
	async (req: Request & { userId?: string }, res: Response) => {}
);

router.put("/:todoId", middleware, async (req: Request & { userId?: string }, res: Response) => {});

export default router;
