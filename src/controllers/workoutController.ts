import express, { Request, Response } from "express";
import { NewSet, NewWorkout, User } from "../db/schema.js";
import { middlewareAuth } from "../middleware.js";
import {
  addSet,
  addUserWorkout,
  deleteUserWorkout,
  getAllWorkouts,
  getSingleWorkout,
} from "../db/queries/workouts.js";
import { respondWithError, respondWithJSON } from "../json.js";

const router = express.Router();

async function getWorkouts(req: Request, res: Response, user: User) {
  try {
    const workouts = await getAllWorkouts(user);
    if (!workouts) {
      respondWithError(res, 404, "No workouts found!");
    }

    respondWithJSON(res, 200, workouts);
  } catch (error) {
    respondWithError(res, 500, "Couldn't get workouts", error);
  }
}

async function addWorkout(req: Request, res: Response, user: User) {
  try {
    const { title, duration, caloriesBurned, sets } = req.body;
    const newWorkout: NewWorkout = {
      title: title,
      date: new Date().toISOString(),
      duration: duration,
      caloriesBurned: caloriesBurned,
      userId: user.id,
    };

    const workout = await addUserWorkout(newWorkout);
    if (!workout) {
      throw new Error("Couldn't save workout");
    }

    for (const s of sets) {
      const newSet: NewSet = {
        setNumber: s.setNumber,
        weights: s.weight,
        reps: s.reps,
        definition: s.definition,
        workout: workout[0].id,
      };

      const set = await addSet(newSet);
      if (!set) {
        throw new Error("Couldn't save set");
      }
    }

    respondWithJSON(res, 200, "Workout saved successfully");
  } catch (error) {
    respondWithError(res, 500, "Couldn't save workout", error);
  }
}

async function getWorkout(req: Request, res: Response, user: User) {
  try {
    const id = req.params.id as string;
    const workout = await getSingleWorkout(id, user.id);

    if (!workout) {
      throw new Error("Couldn't get workout");
    }

    respondWithJSON(res, 200, workout);
  } catch (error) {
    respondWithError(res, 500, "Couldn't get workout", error);
  }
}

async function deleteWorkout(req: Request, res: Response, user: User) {
  try {
    const id = req.params.id as string;

    const rows = await deleteUserWorkout(id, user.id);
    if (rows.length === 0) {
      throw new Error("Workout not found or unauthorized");
    }

    respondWithJSON(res, 200, "Workout deleted successfully");
  } catch (error) {
    respondWithError(res, 500, "Couldn't delete workout", error);
  }
}

router.get("/", middlewareAuth(getWorkouts));

router.post("/", middlewareAuth(addWorkout));

router.get("/:id", middlewareAuth(getWorkout));

router.delete("/:id", middlewareAuth(deleteWorkout));

export default router;
