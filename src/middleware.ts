import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "./config.js";
import { User } from "./db/schema.js";
import { findUserbyId } from "./db/queries/users.js";
import { JwtPayload } from "./types.js";

export function middlewareAuth(
  handler: (req: Request, res: Response, user: User) => void,
) {
  return async (req: Request, res: Response) => {
    try {
      console.log("Middleware Auth");
      console.log(req.headers.authorization);
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("User not authenticated");
      }

      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.verify(
        token,
        config.api.jwtSecret as string,
      ) as JwtPayload;

      const user: User = await findUserbyId(decodedToken.id);
      handler(req, res, user);
    } catch (error) {}
  };
}
