CREATE TABLE `exercise_definitions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`difficulty` text NOT NULL,
	`user_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exercise_sets` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`set_number` integer NOT NULL,
	`weights` real NOT NULL,
	`reps` integer NOT NULL,
	`workout_id` text NOT NULL,
	`definition_id` text NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`definition_id`) REFERENCES `exercise_definitions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text,
	`date` text NOT NULL,
	`duration` integer NOT NULL,
	`caloriesBurned` integer NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
