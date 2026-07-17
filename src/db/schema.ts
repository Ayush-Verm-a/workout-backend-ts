import { randomUUID } from "crypto";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").$defaultFn(() => "FREE USER"),
});

export type NewUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;

export const workoutsTable = sqliteTable("workouts", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text("title"),
  date: text("date").notNull(),
  duration: integer("duration").notNull(),
  caloriesBurned: integer("calories_burned").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export type NewWorkout = typeof workoutsTable.$inferInsert;
export type Workout = typeof workoutsTable.$inferSelect;

export const setsTable = sqliteTable("exercise_sets", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  setNumber: integer("set_number").notNull(),
  weights: real("weight").notNull(),
  reps: integer("reps").notNull(),
  workout: text("workout_id")
    .notNull()
    .references(() => workoutsTable.id, { onDelete: "cascade" }),
  definition: text("definition_id")
    .notNull()
    .references(() => exerciseDefinitionsTable.id, { onDelete: "cascade" }),
});

export type NewSet = typeof setsTable.$inferInsert;
export type Set = typeof setsTable.$inferSelect;

export const exerciseDefinitionsTable = sqliteTable("exercise_definitions", {
  id: text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  muscleGroup: text("muscle_group").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  user: text("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});

export type NewExerciseDefinition =
  typeof exerciseDefinitionsTable.$inferInsert;
