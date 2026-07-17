import type {
  ChatCompletionMessageFunctionToolCall,
  ChatCompletionMessageParam,
} from "openai/resources";
import { getUserWorkout } from "./getUserWorkouts.js";
import { User } from "../db/schema.js";

const functionMap = {
  getUserWorkout: getUserWorkout,
};

export async function callFunction(
  toolCall: ChatCompletionMessageFunctionToolCall,
  user: User,
) {
  const functionName = toolCall.function.name as keyof typeof functionMap;
  const functionArgs = JSON.parse(toolCall.function.arguments);
  functionArgs.user = user;

  console.log("Calling function: ", functionName);
  console.log("Arguments: ", functionArgs);

  const message: ChatCompletionMessageParam = {
    role: "tool",
    tool_call_id: toolCall.id,
    content: `Error: Unknown function: ${functionName}`,
  };

  if (functionName in functionMap) {
    const result = await functionMap[functionName](functionArgs);
    console.log("Result: ", result);

    message.content = JSON.stringify(result);

    return message;
  }

  return message;
}
