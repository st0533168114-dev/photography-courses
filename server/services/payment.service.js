import mongoose from "mongoose";
import orders from "../models/order.js";
import payments from "../models/payment.js";
import users from "../models/user.js";
import shoppingCarts from "../models/shoppingCart.js";
import { getProviderOrderStatus } from "./paymentProvider.service.js";

// עסקה ב-PayPal שלא נגבתה תוך שעה נחשבת נטושה. לפני כן ייתכן שהמשתמש עדיין באמצע התשלום
const PENDING_PAYMENT_TIMEOUT_MS = 60 * 60 * 1000;

export const createPayment = async ({ orderId, paymentMethod, providerOrderId }) => {
  const newPayment = new payments({ orderId, paymentMethod, providerOrderId });
  await newPayment.save();
  return newPayment;
};

export const isCapturePaid = (capture, totalAmount) =>
  capture.status === "COMPLETED" && capture.amount === totalAmount.toFixed(2) && capture.currency === "ILS";

export const completeOrder = async (orderId, paymentId, transactionId) =>
  mongoose.connection.transaction(async (session) => {
    // התנאי על incomplete מונע פתיחת גישה פעמיים בקריאה כפולה
    const order = await orders.findOneAndUpdate(
      { _id: orderId, status: "incomplete" },
      { status: "completed" },
      { new: true, runValidators: true, session }
    );
    if (!order) {
      return null;
    }

    const payment = await payments.findByIdAndUpdate(
      paymentId,
      { status: "success", transactionId },
      { new: true, runValidators: true, session }
    );

    const purchasedCourseIds = order.coursesList.map((course) => course.courseId);
    const user = await users
      .findByIdAndUpdate(
        order.userId,
        { $addToSet: { courseIds: { $each: purchasedCourseIds } } },
        { new: true, session }
      )
      .select("-password");
    if (!user) {
      throw new Error("User not found");
    }

    // רק הקורסים שנקנו - ייתכן שנוסף קורס לעגלה בזמן התשלום
    await shoppingCarts.updateOne(
      { userId: order.userId },
      { $pull: { courseList: { courseId: { $in: purchasedCourseIds } } } },
      { session }
    );

    return { order, payment, user };
  });

const cancelOrder = async (orderId, paymentId) =>
  mongoose.connection.transaction(async (session) => {
    // התנאי על incomplete: 
    // אם המשתמש סיים לשלם בדיוק עכשיו, ההזמנה כבר הושלמה ולא מבטלים אותה
    const order = await orders.findOneAndUpdate(
      { _id: orderId, status: "incomplete" },
      { status: "cancelled" },
      { new: true, runValidators: true, session }
    );
    if (!order) {
      return;
    }
    await payments.findByIdAndUpdate(paymentId, { status: "failed" }, { runValidators: true, session });
  });

// משלים הזמנות ששולמו ב-PayPal אבל לא נשמרו אצלנו, ומבטל הזמנות נטושות
export const syncPendingPayments = async (userId) => {
  const openOrders = await orders.find({ userId, status: "incomplete" });
  if (openOrders.length === 0) {
    return;
  }

  const cutoff = new Date(Date.now() - PENDING_PAYMENT_TIMEOUT_MS);
  const stalePayments = await payments.find({
    orderId: { $in: openOrders.map((order) => order._id) },
    status: "pending",
    paymentDate: { $lt: cutoff },
  });

  for (const payment of stalePayments) {
    // תקלה בתשלום אחד (למשל PayPal לא זמין) לא עוצרת את השאר, ולא מפילה את הבקשה שקראה לפונקציה
    try {
      const order = openOrders.find((openOrder) => openOrder._id.equals(payment.orderId));
      const providerStatus = await getProviderOrderStatus(payment.providerOrderId);

      if (isCapturePaid(providerStatus, order.totalAmount)) {
        await completeOrder(order._id, payment._id, providerStatus.transactionId);
      } else if (providerStatus.status !== "PENDING") {
        // PENDING: הגבייה בוצעה ו-PayPal עדיין מעבד אותה, ולכן לא מבטלים
        await cancelOrder(order._id, payment._id);
      }
    } catch (error) {
      // רק תוכן התשובה: אובייקט השגיאה של axios כולל את ה-token של PayPal
      console.error("syncPendingPayments:", error.response?.data || error.message);
    }
  }
};
