import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import isAdminMiddleware from "../middlewares/isAdmin.middleware.js";
import FaqController from "../controllers/faq.controller.js";

const FaqRouter = express.Router();

FaqRouter.get("/", FaqController.get);
FaqRouter.get("/:id", FaqController.getById);
FaqRouter.post("/", jwtMiddleware, isAdminMiddleware, FaqController.post);
FaqRouter.put("/:id", jwtMiddleware, isAdminMiddleware, FaqController.put);
FaqRouter.delete("/:id", jwtMiddleware, isAdminMiddleware, FaqController.delete);

export default FaqRouter;
