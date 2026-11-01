import axios from "axios";

const CURRENCY = "ILS";

const getAccessToken = async () => {
  const response = await axios.post(
    `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_CLIENT_SECRET,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return response.data.access_token;
};

const providerPost = async (path, body) => {
  const accessToken = await getAccessToken();
  const response = await axios.post(`${process.env.PAYPAL_API_BASE}${path}`, body, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

const providerGet = async (path) => {
  const accessToken = await getAccessToken();
  const response = await axios.get(`${process.env.PAYPAL_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const createProviderOrder = async (amount, referenceId) => {
  const data = await providerPost("/v2/checkout/orders", {
    intent: "CAPTURE",
    purchase_units: [
      {
        custom_id: referenceId,
        amount: { currency_code: CURRENCY, value: amount.toFixed(2) },
      },
    ],
  });
  return { providerOrderId: data.id };
};

export const captureProviderOrder = async (providerOrderId) => {
  try {
    const data = await providerPost(`/v2/checkout/orders/${providerOrderId}/capture`, {});
    const capture = data.purchase_units[0].payments.captures[0];
    return {
      status: capture.status,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      transactionId: capture.id,
    };
  } catch (error) {
    // כרטיס שנדחה אינו תקלה: הקונה יכול לנסות אמצעי תשלום אחר על אותה עסקה
    if (error.response?.data?.details?.[0]?.issue === "INSTRUMENT_DECLINED") {
      return { status: "DECLINED" };
    }
    throw error;
  }
};

// אותו מבנה כמו captureProviderOrder. בעסקה שלא נגבתה אין capture, ומוחזר סטטוס העסקה עצמה (CREATED, APPROVED וכו')
export const getProviderOrderStatus = async (providerOrderId) => {
  const data = await providerGet(`/v2/checkout/orders/${providerOrderId}`);
  const capture = data.purchase_units[0].payments?.captures?.[0];
  if (!capture) {
    return { status: data.status };
  }
  return {
    status: capture.status,
    amount: capture.amount.value,
    currency: capture.amount.currency_code,
    transactionId: capture.id,
  };
};
