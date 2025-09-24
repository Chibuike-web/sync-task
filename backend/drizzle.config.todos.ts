import type { Config } from "drizzle-kit";

export default {
	schema: "./todos/lib/schema.ts",
	out: "./todos/drizzle/tasks",
	dialect: "sqlite",
	dbCredentials: { url: "./todos/todos.db" },
} satisfies Config;
