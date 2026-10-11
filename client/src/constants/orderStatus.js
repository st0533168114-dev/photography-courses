const ORDER_STATUS_LABELS = {
  completed: "הושלמה",
  incomplete: "לא הושלמה",
  cancelled: "בוטלה",
  refunded: "זוכתה",
};

export const getOrderStatusLabel = (status) => ORDER_STATUS_LABELS[status] || ORDER_STATUS_LABELS.incomplete;

// זוכתה נקבעת רק אחרי החזר כספי בפועל מול ספק הסליקה, ולכן אינה ניתנת לבחירה ידנית
export const MANUAL_ORDER_STATUSES = ["incomplete", "completed", "cancelled"];
