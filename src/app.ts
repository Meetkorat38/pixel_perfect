import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// load env variables
dotenv.config();
import { ApiResponse } from "./utils/ApiResponse";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ===== Routes =====
app.get("/health", (_req, res) => {
  res.json(new ApiResponse(200, null, "Server healthy ✅"));
});

export { app };
