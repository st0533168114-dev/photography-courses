import express from "express";
import UsersController from "../controllers/users.controller.js";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import isAdminMiddleware from "../middlewares/isAdmin.middleware.js";
const UsersRouter = express.Router();

UsersRouter.post("/login", UsersController.login);
UsersRouter.post("/register", UsersController.post);

UsersRouter.get("/profile", jwtMiddleware, UsersController.getProfile);
UsersRouter.get("/count", jwtMiddleware, isAdminMiddleware, UsersController.getCount);
UsersRouter.get("/", jwtMiddleware, isAdminMiddleware, UsersController.get);
UsersRouter.get("/:id", jwtMiddleware, isAdminMiddleware, UsersController.getById);
UsersRouter.put("/:id", jwtMiddleware, UsersController.put);
export default UsersRouter;
