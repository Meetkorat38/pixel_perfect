import {z} from "zod"

export const categorySchema = z.object({
  name: z.string().min(1),
}).strict();

export const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().transform((val) => parseFloat(val)).pipe(z.number().positive()),
  stock: z.string().transform((val) => parseInt(val)).pipe(z.number().int().nonnegative()),
  categoryId: z.string(),
  imageUrl: z.string().url().optional(),
}).strict();

export const userCreateSchema = z.object({
  email: z.string().email(),
});

export const userUpdateSchema = userCreateSchema.partial();

export const addToCartSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});