import express from "express";
import cors from "cors";
import authRouter from "./controllers/authController.js";
import userRouter from "./controllers/userController.js";
import { config } from "./config.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["https://*", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
    exposedHeaders: ["Link"],
    credentials: false,
    maxAge: 300,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(config.api.port, () => {
  console.log(`Server is running on port: ${config.api.port}`);
});
