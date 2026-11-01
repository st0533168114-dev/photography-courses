import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import isAdminMiddleware from "../middlewares/isAdmin.middleware.js";
import MediaController from "../controllers/media.controller.js";

const MediaRouter = express.Router();

MediaRouter.post("/signature", jwtMiddleware, isAdminMiddleware, MediaController.sign);

export default MediaRouter;
