import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// load env variables
dotenv.config();
import { ApiResponse } from "./utils/ApiResponse.js";
import { productsRouter } from "./routes/products.routes.js";
import { categoriesRouter } from "./routes/categories.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { usersRouter } from "./routes/users.routes.js";

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// ===== Routes =====
app.get("/", (_req, res) => {
  res.json(new ApiResponse(200, {
    message: "Welcome to Pixel Perfect E-commerce API",
    documentation: {
      baseUrl: process.env.NODE_ENV === 'production' ? process.env.HOSTED_URI : 'http://localhost:3000',
      endpoints: {
        health: {
          "GET /health": "Check server health status"
        },
        categories: {
          "GET /categories": "Get all categories with products",
          "POST /categories": "Create a new category (Body: {name: string})"
        },
        products: {
          "GET /products": "Get all products (Query: ?categoryId=id&search=term)",
          "GET /products/:id": "Get single product by ID",
          "POST /products": "Create product (Form-data: title, description, price, stock, categoryId, image)",
          "PUT /products/:id": "Update product (Form-data: any product fields)",
          "DELETE /products/:id": "Delete product"
        },
        cart: {
          "GET /cart?userId=id": "Get cart items for user",
          "POST /cart": "Add item to cart (Body: {userId, productId, quantity})",
          "DELETE /cart/:itemId": "Remove item from cart"
        },
        users: {
          "GET /users": "Get all users",
          "GET /users/:id": "Get user by ID",
          "POST /users": "Create user (Body: {email})",
          "PUT /users/:id": "Update user",
          "DELETE /users/:id": "Delete user"
        }
      },
    }
  }, "API Documentation & Routes"));
});

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
