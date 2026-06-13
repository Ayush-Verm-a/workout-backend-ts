import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { NewUser } from "../db/schema.js";
import { createUser, findUserByEmail } from "../db/queries/users.js";
import { respondWithError, respondWithJSON } from "../json.js";
import { config } from "../config.js";
import { JwtPayload } from "../types.js";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  console.log("Register controller");
  const { name, email, password } = req.body;

  const exists = await findUserByEmail(email);
  if (exists) {
    respondWithError(res, 409, "User already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: NewUser = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  try {
    const newUser = await createUser(user);
    if (newUser) {
      respondWithJSON(res, 201, "User created successfully!");
    } else {
      respondWithJSON(res, 500, "Error creating user");
    }
  } catch (error) {
    console.log((error as Error).message);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("Login controller");
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      respondWithError(res, 401, "Wrong email or password");
      console.log("User not found");
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      respondWithError(res, 401, "Wrong email or password");
      console.log("Wrong password");
      return;
    }

    const token = generateToken(user.id);
    respondWithJSON(res, 200, { accessToken: token });
  } catch (error) {
    respondWithError(res, 500, "Login failed", error);
  }
});

const generateToken = (id: string): string => {
  return jwt.sign({ id: id } as JwtPayload, config.api.jwtSecret as string, {
    expiresIn: "7d",
  });
};

export default router;
