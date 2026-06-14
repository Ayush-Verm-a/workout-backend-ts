import express, { Request, Response } from "express";
import { User } from "../db/schema.js";
import { respondWithJSON } from "../json.js";
import { middlewareAuth } from "../middleware.js";

const router = express.Router();

async function getUser(req: Request, res: Response, user: User) {
  try {
    const profile = { name: user.name, email: user.email, role: user.role };
    respondWithJSON(res, 200, profile);
  } catch (error) {
    console.log((error as Error).message);
  }
}

router.get("/me", middlewareAuth(getUser));

export default router;
