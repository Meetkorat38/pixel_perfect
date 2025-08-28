import { Router } from "express";
import {addToCart, getCartItems, removeFromCart} from "../controllers/cart.controller.js"
const cartRouter = Router();

// stubbed handlers
cartRouter.post("/", addToCart);
cartRouter.get("/", getCartItems);
cartRouter.delete("/:itemId", removeFromCart);

export { cartRouter };
