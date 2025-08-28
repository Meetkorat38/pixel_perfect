import { Router } from "express";
import {addToCart, getCartItems, removeFromCart} from "../controllers/cart.controller"
const cartRouter = Router();

// stubbed handlers
cartRouter.post("/", addToCart);
cartRouter.get("/", getCartItems);
cartRouter.delete("/:itemId", removeFromCart);

export { cartRouter };
