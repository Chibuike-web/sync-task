PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`task_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`task_name` text NOT NULL,
	`task_description` text NOT NULL,
	`task_status` text NOT NULL,
	`task_priority` text NOT NULL,
	`task_start_date` text NOT NULL,
	`task_due_date` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("task_id", "user_id", "task_name", "task_description", "task_status", "task_priority", "task_start_date", "task_due_date") SELECT "task_id", "user_id", "task_name", "task_description", "task_status", "task_priority", "task_start_date", "task_due_date" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "first_name", "last_name", "email", "password") SELECT "id", "first_name", "last_name", "email", "password" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;