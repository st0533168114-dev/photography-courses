import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import isAdminMiddleware from "../middlewares/isAdmin.middleware.js";
import ContactMessagesController from "../controllers/contactMessages.controller.js";

const ContactMessagesRouter = express.Router();

ContactMessagesRouter.get("/count", jwtMiddleware, isAdminMiddleware, ContactMessagesController.getCount);
ContactMessagesRouter.get("/", jwtMiddleware, isAdminMiddleware, ContactMessagesController.get);
// פתוח לכולם - גם מבקר שאינו מחובר יכול לשלוח פנייה
ContactMessagesRouter.post("/", ContactMessagesController.post);
ContactMessagesRouter.put("/:id/status", jwtMiddleware, isAdminMiddleware, ContactMessagesController.changeStatus);
ContactMessagesRouter.delete("/:id", jwtMiddleware, isAdminMiddleware, ContactMessagesController.delete);

export default ContactMessagesRouter;
