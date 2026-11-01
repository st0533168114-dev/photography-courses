import mongoose from "mongoose";
import orders from "../Models/order.js";
import payments from "../Models/payment.js";
import shoppingCarts from "../Models/shoppingCart.js";
import users from "../Models/user.js";
import { resolveCart } from "../Services/shoppingCart.service.js";
import { createPayment, completeOrder } from "../Services/payment.service.js";
import { createProviderOrder, captureProviderOrder } from "../Services/paymentProvider.service.js";

const OrdersController = {
  get: async (req, res) => {
    try {
      const filter = req.query.userId ? { userId: req.query.userId } : {};

      const ordersList = await orders
        .find(filter)
        .populate("userId", "firstName lastName email")
        .populate("paymentsList")
        .sort({ orderDate: -1 });
      res.status(200).json(ordersList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getCount: async (req, res) => {
    try {
      const count = await orders.countDocuments({});
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.userId; // מגיע מהטוקן המפוענח ב-jwtMiddleware ולא מהלקוח

      const userOrders = await orders
        .find({ userId: userId })
        .populate("paymentsList")
        .sort({ orderDate: -1 });
      res.status(200).json(userOrders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.userId;
    const userRole = req.user.role;
    try {
      const order = await orders
        .findById(orderId)
        .populate("userId", "firstName lastName email")
        .populate("paymentsList");
      if (!order) {
        return res.status(404).json({ message: "ההזמנה לא נמצאה" });
      }
      if (order.userId?._id.toString() !== userId && userRole !== "admin") {
        return res.status(403).json({ message: "אין הרשאה לצפות בהזמנה זו" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ההזמנה נבנית בשרת מתוך עגלת הקניות של המשתמש - גוף הבקשה אינו משמש
  post: async (req, res) => {
    try {
      const userId = req.user.userId;
      const userCart = await shoppingCarts.findOne({ userId: userId });
      if (!userCart || userCart.courseList.length === 0) {
        return res.status(400).json({ message: "לא ניתן לבצע הזמנה עם סל ריק" });
      }

      const resolvedCart = await resolveCart(userCart);

      const unavailableCourse = resolvedCart.courseList.find((item) => !item.isAvailable);
      if (unavailableCourse) {
        return res
          .status(400)
          .json({ message: `הקורס "${unavailableCourse.courseName}" אינו זמין לרכישה כעת` });
      }

      if (resolvedCart.courseList.length === 0) {
        return res.status(400).json({ message: "לא ניתן לבצע הזמנה עם סל ריק" });
      }

      const buyer = await users.findById(userId).select("courseIds");
      const ownedCourseIds = (buyer?.courseIds || []).map((id) => id.toString());
      const alreadyOwnedCourse = resolvedCart.courseList.find((item) =>
        ownedCourseIds.includes(item.courseId.toString())
      );
      if (alreadyOwnedCourse) {
        return res
          .status(409)
          .json({ message: `הקורס "${alreadyOwnedCourse.courseName}" כבר נרכש` });
      }

      const coursesList = resolvedCart.courseList.map((item) => ({
        courseId: item.courseId,
        courseName: item.courseName,
        price: item.price,
      }));
      const totalAmount = resolvedCart.subtotal;
      if (totalAmount <= 0) {
        return res.status(400).json({ message: "אין בהזמנה קורסים בתשלום" });
      }

      // נשמרת רק אחרי פתיחת העסקה, כדי שלא תישאר הזמנה בלי תשלום. ה-_id נוצר כבר ב-new
      const newOrder = new orders({
        userId: userId,
        coursesList,
        totalAmount,
      });
      const { providerOrderId } = await createProviderOrder(totalAmount, newOrder._id.toString());
      const newPayment = await createPayment({
        orderId: newOrder._id,
        paymentMethod: "PayPal",
        providerOrderId,
      });
      newOrder.paymentsList.push(newPayment._id);
      await newOrder.save();

      res.status(201).json({ order: newOrder, payments: newPayment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  // הגבייה מחוץ לטרנזקציה, כי טרנזקציה לא יכולה לבטל חיוב שכבר בוצע
  capture: async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "מזהה הזמנה לא תקין" });
    }
    try {
      const order = await orders.findById(id);
      if (!order) {
        return res.status(404).json({ message: "ההזמנה לא נמצאה" });
      }
      if (order.userId.toString() !== req.user.userId) {
        return res.status(403).json({ message: "אין הרשאה לשלם על הזמנה זו" });
      }
      if (order.status !== "incomplete") {
        return res.status(409).json({ message: "ההזמנה כבר שולמה או בוטלה" });
      }

      const payment = await payments.findOne({ orderId: order._id, status: "pending" });
      if (!payment) {
        return res.status(409).json({ message: "אין תשלום ממתין להזמנה זו" });
      }

      const capture = await captureProviderOrder(payment.providerOrderId);
      if (capture.status === "DECLINED") {
        return res.status(400).json({ message: "התשלום נדחה, אפשר לנסות אמצעי תשלום אחר" });
      }
      const isPaid =
        capture.status === "COMPLETED" &&
        capture.amount === order.totalAmount.toFixed(2) &&
        capture.currency === "ILS";
      if (!isPaid) {
        await payments.findByIdAndUpdate(payment._id, { status: "failed" }, { runValidators: true });
        return res.status(400).json({ message: "התשלום לא אושר, והגישה לקורסים לא נפתחה" });
      }

      const result = await completeOrder(order._id, payment._id, capture.transactionId);
      if (!result) {
        return res.status(409).json({ message: "ההזמנה כבר שולמה או בוטלה" });
      }

      res.status(200).json({ order: result.order, payments: result.payment, user: result.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
};
export default OrdersController;
