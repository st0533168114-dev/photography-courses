import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

// ניסיון תשלום אחד של הזמנה ב-orders. רק השרת יוצר ומעדכן אותו, לפי תשובת ספק הסליקה
const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: ObjectId,
    ref: "orders",
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  // מספר התשלום בתוך ההזמנה - כרגע תמיד 1 כי אין תשלומים מרובים
  paymentNumber: {
    type: Number,
    required: true,
    default: 1,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  providerOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  // נוצר רק אחרי גבייה, לכן הרבה רשומות בלי ערך.
// sparse מאפשר זאת, ועדיין מונע כפילות בין מזהים קיימים.
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

export default mongoose.model("payments", PaymentSchema);
