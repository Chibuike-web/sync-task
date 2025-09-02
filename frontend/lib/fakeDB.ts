import type { UserType } from "@/app/schemas/userSchema";

declare global {
	var users: UserType[] | undefined;
}

export const users: UserType[] = globalThis.users ?? [];
if (process.env.NODE_ENV !== "production") globalThis.users = users;
