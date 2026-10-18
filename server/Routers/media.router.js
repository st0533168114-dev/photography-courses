import express from "express";
import jwtMiddleware from "../Middlewares/jwt.middleware.js";
import isAdminMiddleware from "../Middlewares/isAdmin.middleware.js";
import MediaController from "../Controllers/media.controller.js";

const MediaRouter = express.Router();

MediaRouter.post("/signature", jwtMiddleware, isAdminMiddleware, MediaController.sign);

export default MediaRouter;
