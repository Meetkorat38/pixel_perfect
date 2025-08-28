import { Router } from "express";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller";

const usersRouter = Router();

usersRouter.get("/", listUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post("/", createUser);
usersRouter.put("/:id", updateUser);
usersRouter.delete("/:id", deleteUser);

export { usersRouter };
