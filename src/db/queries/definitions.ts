import { eq, or } from "drizzle-orm";
import { assertDbConnection, db } from "../index.js";
import {
  exerciseDefinitionsTable,
  NewExerciseDefinition,
  User,
  usersTable,
} from "../schema.js";

export async function getAllDefinitions(user: User) {
  assertDbConnection();
  const rows = await db!
    .select({
      id: exerciseDefinitionsTable.id,
      name: exerciseDefinitionsTable.name,
      muscleGroup: exerciseDefinitionsTable.muscleGroup,
      category: exerciseDefinitionsTable.category,
      description: exerciseDefinitionsTable.description,
      difficulty: exerciseDefinitionsTable.difficulty,
    })
    .from(exerciseDefinitionsTable)
    .innerJoin(usersTable, eq(exerciseDefinitionsTable.user, usersTable.id))
    .where(
      or(
        eq(usersTable.role, "ADMIN"),
        eq(exerciseDefinitionsTable.user, user.id),
      ),
    );
  return rows;
}

export async function addNewDefinition(def: NewExerciseDefinition) {
  assertDbConnection();

  const rows = await db!
    .insert(exerciseDefinitionsTable)
    .values(def)
    .returning();
  return rows;
}
