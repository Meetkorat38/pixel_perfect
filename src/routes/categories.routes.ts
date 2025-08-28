import { Router } from "express";
import {getAllCategories, createCategory} from '../controllers/categories.controller'
const categoriesRouter = Router();

// stubbed handlers
categoriesRouter.get("/", getAllCategories);
categoriesRouter.post("/", createCategory);

export { categoriesRouter };
