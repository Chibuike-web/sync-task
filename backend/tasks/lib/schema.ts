import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const tasks = sqliteTable("tasks", {
	taskId: text("task_id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	taskName: text("task_name").notNull(),
	taskDescription: text("task_description").notNull(),
	taskStatus: text("task_status").notNull(),
	taskPriority: text("task_priority").notNull(),
	taskStartDate: text("task_start_date").notNull(),
	taskDueDate: text("task_due_date").notNull(),
});
