import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { addToCartSchema } from "../types/validate.js";

// POST /cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, quantity } = addToCartSchema.parse(req.body);

    // check user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    // check product
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new ApiError(404, "Product not found");

    // check if already in cart
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    let cartItem;
    if (existing) {
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, quantity },
      });
    }

    res.status(201).json(new ApiResponse(201, cartItem, "Item added to cart"));
  } catch (err) {
    next(err);
  }
};

// GET /cart?userId=xxx
export const getCartItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) throw new ApiError(400, "userId query param is required");

    // check user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    // calculate totals
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * Number(item?.product?.price ?? 0),
      0
    );

    res.json(
      new ApiResponse(200, { cartItems, totalQuantity, totalPrice }, "Cart items fetched")
    );
  } catch (err) {
    next(err);
  }
};


// DELETE /cart/:itemId?userId=xxx
export const removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId } = req.params;
    const userId = req.query.userId as string;
    if (!userId) throw new ApiError(400, "userId query param is required");

    // validate user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    // validate cart item
    const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
    if (!cartItem || cartItem.userId !== userId) {
      throw new ApiError(404, "Cart item not found for this user");
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    res.json(new ApiResponse(200, null, "Item removed from cart"));
  } catch (err) {
    next(err);
  }
};
