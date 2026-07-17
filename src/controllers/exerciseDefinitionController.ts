import express, { Request, Response } from "express";
import { middlewareAuth } from "../middleware.js";
import { NewExerciseDefinition, User } from "../db/schema.js";
import {
  addNewDefinition,
  getAllDefinitions,
} from "../db/queries/definitions.js";
import { respondWithError, respondWithJSON } from "../json.js";

const router = express.Router();

async function getDefinitions(req: Request, res: Response, user: User) {
  try {
    const definitions = await getAllDefinitions(user);
    if (!definitions || definitions.length === 0) {
      respondWithError(res, 404, "No definitions found");
      return;
    }
    respondWithJSON(res, 200, definitions);
  } catch (error) {
    respondWithError(res, 500, "Couldn't get exercise definitions", error);
  }
}

async function addDefinition(req: Request, res: Response) {
  try {
    console.log("Add definition called");
    const { name, muscleGroup, category, description, difficulty, user } =
      req.body;

    const newDefinition: NewExerciseDefinition = {
      name: name,
      muscleGroup: muscleGroup,
      category: category,
      description: description,
      difficulty: difficulty,
      user: user,
    };

    const definition = await addNewDefinition(newDefinition);
    if (!definition) {
      respondWithError(res, 500, "Could not save the definition");
    }

    respondWithJSON(res, 200, "Definition created successfully!");
  } catch (error) {
    respondWithError(res, 500, "Couldn't create the definition", error);
  }
}

router.get("/", middlewareAuth(getDefinitions));

router.post("/", middlewareAuth(addDefinition));

export default router;
