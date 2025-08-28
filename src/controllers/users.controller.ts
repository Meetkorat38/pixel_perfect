import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().email(),
});

export const userUpdateSchema = userCreateSchema.partial();

// GET /users
export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
    res.json(new ApiResponse(200, users, "Users fetched"));
  } catch (err) {
    next(err);
  }
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        cartItems: {
          include: { product: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!user) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(200, user, "User fetched"));
  } catch (err) {
    next(err);
  }
};

// POST /users
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = userCreateSchema.parse(req.body);
    const user = await prisma.user.create({ data });
    res.status(201).json(new ApiResponse(201, user, "User created"));
  } catch (err: any) {
   
    next(err);
  }
};

// PUT /users/:id
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = userUpdateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });
    res.json(new ApiResponse(200, user, "User updated"));
  } catch (err) {
    next(err);
  }
};

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    // delete related cart items first (avoids FK constraint issues)
    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    res.json(new ApiResponse(200, null, "User deleted"));
  } catch (err) {
    next(err);
  }
};
