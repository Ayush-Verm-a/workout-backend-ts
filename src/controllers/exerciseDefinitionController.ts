import express, { Request, Response } from "express";
import { middlewareAuth } from "../middleware.js";
import { User } from "../db/schema.js";
import { getAllDefinitions } from "../db/queries/definitions.js";
import { respondWithError, respondWithJSON } from "../json.js";

const router = express.Router();

async function getDefinitions(req: Request, res: Response, user: User) {
  try {
    const definitions = getAllDefinitions(user);
    respondWithJSON(res, 200, definitions);
  } catch (error) {
    respondWithError(res, 500, "Couldn't get exercise definitions", error);
  }
}

async function addDefinition(req: Request, res: Response, user: User) {
  try {
    // To be implemented later
  } catch (error) {}
}

router.get("/", middlewareAuth(getDefinitions));

router.post("/", middlewareAuth(addDefinition));

export default router;
