import { eq } from "drizzle-orm";
import { assertDbConnection, db } from "../index.js";
import {
  exerciseDefinitionsTable,
  NewSet,
  NewWorkout,
  setsTable,
  User,
  usersTable,
  workoutsTable,
} from "../schema.js";

export async function getAllWorkouts(user: User) {
  assertDbConnection();

  const rows = await db!
    .select({
      id: workoutsTable.id,
      title: workoutsTable.title,
      date: workoutsTable.date,
      duration: workoutsTable.duration,
      caloriedBurned: workoutsTable.caloriesBurned,
    })
    .from(workoutsTable)
    .where(eq(usersTable.id, user.id));

  return rows;
}

export async function addUserWorkout(workout: NewWorkout) {
  assertDbConnection();

  const rows = await db!.insert(workoutsTable).values(workout).returning();
  return rows;
}

export async function addSet(set: NewSet) {
  assertDbConnection();

  const rows = await db!.insert(setsTable).values(set).returning();
  return rows;
}
