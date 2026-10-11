import express from "express";
import OrdersController from "../Controllers/orders.controller.js";
import jwtMiddleware from "../Middlewares/jwt.middleware.js";
import isAdminMiddleware from "../Middlewares/isAdmin.middleware.js";

const OrdersRouter = express.Router();
OrdersRouter.get("/", jwtMiddleware, isAdminMiddleware, OrdersController.get);
OrdersRouter.get("/user-orders", jwtMiddleware, OrdersController.getUserOrders);
OrdersRouter.get("/count", jwtMiddleware, isAdminMiddleware, OrdersController.getCount);
OrdersRouter.get("/:id", jwtMiddleware, OrdersController.getById);
OrdersRouter.post("/", jwtMiddleware, OrdersController.post);
OrdersRouter.put("/:id", jwtMiddleware, isAdminMiddleware, OrdersController.put);
export default OrdersRouter;
