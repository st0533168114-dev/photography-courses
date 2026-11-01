import express from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import isAdminMiddleware from "../middlewares/isAdmin.middleware.js";

import PaymentsController from "../controllers/payments.controller.js";
const PaymentsRouter = express.Router();

PaymentsRouter.get("/", jwtMiddleware, isAdminMiddleware, PaymentsController.get);
PaymentsRouter.get("/:id", jwtMiddleware, PaymentsController.getById);
export default PaymentsRouter;
