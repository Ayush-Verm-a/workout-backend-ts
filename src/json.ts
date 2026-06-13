import { type Response } from "express";

export function respondWithJSON(res: Response, code: number, payload: unknown) {
  if (typeof payload !== "object" && typeof payload !== "string") {
    throw new Error("Invalid response payload");
  }

  res.setHeader("Content-Type", "application/json");
  const body = JSON.stringify(payload);
  res.status(code).send(body);
  res.end();
}

export function respondWithError(
  res: Response,
  code: number,
  message: string,
  error?: unknown,
) {
  if (error) {
    console.log((error as Error).message);
  }

  respondWithJSON(res, code, { error: message });
}
