const PAYMENT_STATUS_LABELS = {
  pending: "ממתין",
  success: "הצליח",
  failed: "נכשל",
};

export const getPaymentStatusLabel = (status) => PAYMENT_STATUS_LABELS[status] || PAYMENT_STATUS_LABELS.pending;
