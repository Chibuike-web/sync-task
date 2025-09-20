import { z } from "zod";

export const authSchema = z.object({
	id: z.string().optional(),
	email: z
		.string()
		.min(1, "Email is required")
		.min(6, "Enter a valid email address")
		.refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Invalid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must contain at least 6 character"),
});

export type FormData = z.infer<typeof authSchema>;
