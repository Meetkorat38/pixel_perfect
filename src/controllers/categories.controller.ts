import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/index";
import { ApiResponse } from "../utils/ApiResponse";
import { z } from "zod";

// ✅ Zod schema - strict mode rejects any extra fields
const categorySchema = z.object({
  name: z.string().min(1),
}).strict();

export const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({ include: { products: true } });
    res.json(new ApiResponse(200, categories, "Categories fetched successfully"));
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use parse instead of safeParse to let Zod throw the error
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.create({ data });
    res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
  } catch (err) {
    next(err);
  }
};
