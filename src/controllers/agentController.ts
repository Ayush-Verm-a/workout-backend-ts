import express, { Request, Response } from "express";
import { middlewareAuth } from "../middleware.js";
import { User } from "../db/schema.js";
import { config } from "../config.js";
import OpenAI from "openai";
import { schemaGetUserWorkout } from "../functions/getUserWorkouts.js";
import type { ChatCompletionMessageParam } from "openai/resources";
import { respondWithError, respondWithJSON } from "../json.js";
import { callFunction } from "../functions/callFunction.js";

const availableFunctions = [schemaGetUserWorkout];

const router = express.Router();

async function generateResponse(req: Request, res: Response, user: User) {
  try {
    console.log("/api/chat/completions called");
    const { prompt } = req.body;
    const apiKey = config.agent.apiKey;

    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    });

    const systemPrompt = `
      # Role
      Your are an AI Fitness Coach that helps with user questions related to fitness and workout only

      # Tools
      - **getUserWorkout(days)** - fetches the workouts of the user from past days

      # Communication
      Provide a concise response to the user's question in a markdown format
      `;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];

    let finalMessage: string | null = "";

    for (let i = 0; i < 5; i++) {
      const response = await client.chat.completions.create({
        model: "tencent/hy3:free",
        messages: messages,
        tools: availableFunctions,
      });

      const message = response.choices[0].message;

      messages.push(message);

      if (message.tool_calls) {
        for (let toolCall of message.tool_calls) {
          if (toolCall.type === "function") {
            const resultMessage = await callFunction(toolCall, user);
            messages.push(resultMessage);

            if (!resultMessage.content) {
              throw new Error(
                "Received empty message content from the function call",
              );
            }
          } else {
            console.log("Skipping non-function tool call: ", toolCall.type);
          }
        }
      } else {
        finalMessage = message.content;
        respondWithJSON(res, 200, finalMessage);
        return;
      }
    }
    respondWithError(res, 500, "Agent took too long to respond");
  } catch (error) {
    respondWithError(res, 500, "Couldn't fetch the response", error);
  }
}

router.post("/completions", middlewareAuth(generateResponse));

export default router;
