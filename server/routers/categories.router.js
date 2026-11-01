import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import isAdminMiddleware from "../middlewares/isAdmin.middleware.js";

import CategoriesController from "../controllers/category.controller.js";
const CategoriesRouter = express.Router();

CategoriesRouter.get("/", CategoriesController.get);
CategoriesRouter.get("/:id", CategoriesController.getById);
CategoriesRouter.post("/", jwtMiddleware, isAdminMiddleware, CategoriesController.post);
CategoriesRouter.put("/:id", jwtMiddleware, isAdminMiddleware, CategoriesController.put);
CategoriesRouter.delete("/:id", jwtMiddleware, isAdminMiddleware, CategoriesController.delete);
export default CategoriesRouter;
