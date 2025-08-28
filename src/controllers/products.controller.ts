import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { productSchema } from "../types/validate";

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, search } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(categoryId ? { categoryId: String(categoryId) } : {}),
        ...(search ? { title: { contains: String(search), mode: "insensitive" } } : {}),
      },
      include: { category: true },
    });

    res.json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    if (!product) throw new ApiError(404, "Product not found");

    res.json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = productSchema.parse(req.body);

    let imageUrl: string | undefined | null;
    if (req.file?.path) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const product = await prisma.product.create({
      data: { ...parsed, imageUrl },
    });

    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = productSchema.partial().parse(req.body);

    // fetch existing product
    const existingProduct = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existingProduct) throw new ApiError(404, "Product not found");

    let imageUrl = existingProduct.imageUrl;

    // if new image uploaded
    if (req.file?.path) {
      imageUrl = await uploadOnCloudinary(req.file.path);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...parsed, imageUrl },
    });

    res.json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });

    res.json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (err) {
    next(err);
  }
};
