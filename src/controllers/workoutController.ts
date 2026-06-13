import express, { Request, Response } from "express";
import { User } from "../db/schema.js";
import { middlewareAuth } from "../middleware.js";

const router = express.Router();

async function getAllWorkouts(req: Request, res: Response, user: User) {
  try {
    console.log(req.body);
  } catch (error) {}
}

async function addWorkout(req: Request, res: Response, user: User) {
  try {
    console.log(req.body);
  } catch (error) {}
}

async function getWorkout(req: Request, res: Response, user: User) {
  try {
    console.log(req.body);
    console.log(req.params.id);
  } catch (error) {}
}

async function deleteWorkout(req: Request, res: Response, user: User) {
  try {
    console.log(req.body);
  } catch (error) {}
}

router.get("/", middlewareAuth(getAllWorkouts));

router.post("/", middlewareAuth(addWorkout));

router.get("/:id", middlewareAuth(getWorkout));

router.delete("/:id", middlewareAuth(deleteWorkout));

export default router;
