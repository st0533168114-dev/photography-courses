import mongoose from "mongoose";
import orders from "../Models/order.js";
import payments from "../Models/payment.js";
import users from "../Models/user.js";
import shoppingCarts from "../Models/shoppingCart.js";

export const createPayment = async ({ orderId, paymentMethod, providerOrderId }) => {
  const newPayment = new payments({ orderId, paymentMethod, providerOrderId });
  await newPayment.save();
  return newPayment;
};

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
