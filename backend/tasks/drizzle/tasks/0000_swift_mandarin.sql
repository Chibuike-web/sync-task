CREATE TABLE `tasks` (
	`task_id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`task_name` text NOT NULL,
	`task_description` text NOT NULL,
	`task_status` text NOT NULL,
	`task_priority` text NOT NULL,
	`task_start_date` text NOT NULL,
	`task_due_date` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text,
	`last_name` text,
	`email` text NOT NULL,
	`password` text NOT NULL
);
