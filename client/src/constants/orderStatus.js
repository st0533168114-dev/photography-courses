const ORDER_STATUS_LABELS = {
  completed: "הושלמה",
  incomplete: "לא הושלמה",
  cancelled: "בוטלה",
  refunded: "זוכתה",
};

export const getOrderStatusLabel = (status) => ORDER_STATUS_LABELS[status] || ORDER_STATUS_LABELS.incomplete;
