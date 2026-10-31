import payments from "../Models/payment.js";

const PaymentsController = {
  get: async (req, res) => {
    try {
      const paymentsList = await payments.find({});
      res.status(200).json(paymentsList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    const id = req.params.id;
    try {
      // populate נדרש כדי לבדוק בעלות - היא נקבעת לפי בעל ההזמנה ולא לפי התשלום עצמו
      const payment = await payments.findById(id).populate("orderId");

      if (!payment) {
        return res.status(404).json({ message: "התשלום לא נמצא" });
      }

      const isOrderOwner = payment.orderId && payment.orderId.userId.toString() === req.user.userId;
      if (!isOrderOwner && req.user.role !== "admin") {
        return res.status(403).json({ message: "אין הרשאה לצפות בתשלום זה" });
      }
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default PaymentsController;
