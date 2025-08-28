import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// load env variables
dotenv.config();
import { ApiResponse } from "./utils/ApiResponse";
import { productsRouter } from "./routes/products.routes";
import { categoriesRouter } from "./routes/categories.routes";
import { cartRouter } from "./routes/cart.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { usersRouter } from "./routes/users.routes";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// ===== Routes =====
app.get("/health", (_req, res) => {
  res.json(new ApiResponse(200, null, "Server healthy ✅"));
});

app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartRouter);
app.use("/users", usersRouter);

// ===== Error Handler (must be last) =====
app.use(errorHandler);

export { app };
