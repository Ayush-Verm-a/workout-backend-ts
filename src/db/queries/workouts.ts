import {
  and, eq, gte
} from "drizzle-orm";
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
    .where(eq(workoutsTable.userId, user.id));

  return rows;
}

export async function getSingleWorkout(id: string, userId: string) {
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
    .where(and(eq(workoutsTable.id, id), eq(workoutsTable.userId, userId)));

  const sets = await db!
    .select({
      id: setsTable.id,
      setNumber: setsTable.setNumber,
      weight: setsTable.weights,
      reps: setsTable.reps,
      definition: setsTable.definition,
    })
    .from(setsTable)
    .where(eq(setsTable.workout, id));

  if (rows.length === 0) {
    throw new Error(`Couldn't find the workout: ${id}`);
  }
  if (sets.length === 0) {
    throw new Error(`Couldn't find the sets for workout: ${id}`);
  }

  type Set = {
    id: string;
    reps: number;
    weight: number;
    setNumber: number;
    definition: Record<string, string>;
  };

  const workout = {
    id: rows[0].id,
    title: rows[0].title,
    date: rows[0].date,
    duration: rows[0].duration,
    caloriesBurned: rows[0].caloriedBurned,
    sets: [] as Set[],
  };

  for (const set of sets) {
    workout.sets.push({
      id: set.id,
      setNumber: set.setNumber,
      weight: set.weight,
      reps: set.reps,
      definition: {
        id: set.definition,
        name: "Exercise Name",
        muscleGroup: "Muscle Group",
      },
    });
  }

  return workout;
}

export async function addUserWorkout(workout: NewWorkout) {
  assertDbConnection();

  const rows = await db!.insert(workoutsTable).values(workout).returning();
  return rows;
}

export async function deleteUserWorkout(id: string, userId: string) {
  assertDbConnection();

  const rows = await db!
    .delete(workoutsTable)
    .where(and(eq(workoutsTable.userId, userId), eq(workoutsTable.id, id)))
    .returning();

  const setRows = await db!
    .delete(setsTable)
    .where(eq(setsTable.workout, id))
    .returning();
  return rows;
}

export async function addSet(set: NewSet) {
  assertDbConnection();

  const rows = await db!.insert(setsTable).values(set).returning();
  return rows;
}

export async function getRecentWorkouts(user: User, days: number) {
  assertDbConnection();

  // Calculate the date string for `n` days ago
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days);
  const isoDateLimit = pastDate.toISOString();

  const rows = await db!
    .select({
      id: workoutsTable.id,
      title: workoutsTable.title,
      date: workoutsTable.date,
      duration: workoutsTable.duration,
      caloriedBurned: workoutsTable.caloriesBurned, // Kept this matching your other queries
    })
    .from(workoutsTable)
    .where(
      and(
        eq(workoutsTable.userId, user.id),
        gte(workoutsTable.date, isoDateLimit)
      )
    );

  return rows;
}
