import { ChatCompletionTool } from "openai/resources";
import { User } from "../db/schema.js";
import { getRecentWorkouts } from "../db/queries/workouts.js";

export const schemaGetUserWorkout: ChatCompletionTool = {
  type: "function",
  function: {
    name: "getUserWorkout",
    description: "Gets the user's workouts from the last n days",
    parameters: {
      type: "object",
      properties: {
        days: {
          type: "integer",
          description:
            "The number of days to look back for workouts (e.g., 7 for the last week)",
        },
      },
      required: ["days"],
    },
  },
};

export async function getUserWorkout({
  days,
  user,
}: {
  days: number;
  user: User;
}) {
  const result = await getRecentWorkouts(user, days);
  return result;
}
