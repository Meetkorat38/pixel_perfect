import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { upload } from "../middlewares/multer.middleware";

const productsRouter = Router();

productsRouter.get("/", getAllProducts);
productsRouter.get("/:id", getProductById);
productsRouter.post("/", upload.single("image"), createProduct); 
productsRouter.put("/:id", upload.single("image"), updateProduct);
productsRouter.delete("/:id", deleteProduct);

export { productsRouter };
