import express from "express";
import jwtMiddleware from "../Middlewares/jwt.middleware.js";
import isAdminMiddleware from "../Middlewares/isAdmin.middleware.js";

import PaymentsController from "../Controllers/payments.controller.js";
const PaymentsRouter = express.Router();

PaymentsRouter.get("/", jwtMiddleware, isAdminMiddleware, PaymentsController.get);
PaymentsRouter.get("/:id", jwtMiddleware, PaymentsController.getById);
export default PaymentsRouter;
