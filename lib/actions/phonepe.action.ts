import { SERVER_URL } from "../constants";

// to obtain an OAuth Bearer token for phonepe payment
export const getPhonePeToken = async () => {
  const encodedData = new URLSearchParams({
    client_id: process.env.PHONEPE_CLIENT_ID || "",
    client_version: process.env.PHONEPE_CLIENT_VERSION || "1",
    client_secret: process.env.PHONEPE_CLIENT_SECRET || "",
    grant_type: "client_credentials",
  });

  const url = process.env.PHONEPE_ENV === "PROD" 
    ? "https://api.phonepe.com/apis/pg/v1/oauth/token"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("PhonePe Token Error:", errorText);
    throw new Error("Failed to get PhonePe access token");
  }

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.access_token;
  } catch (parseError) {
    console.error("PhonePe Token Parse Error:", parseError);
    console.error("Raw token response:", text);
    throw new Error("Failed to parse PhonePe access token response");
  }
};

// to initiate payment with PhonePe
export const createPhonePePayment = async (
  merchantOrderId: string,
  amount: number,
  redirectUrl: string
) => {
  const token = await getPhonePeToken();

  const url = process.env.PHONEPE_ENV === "PROD"
    ? "https://api.phonepe.com/apis/pg/checkout/v2/pay"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

  // PhonePe amounts are in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amount * 100);

  const payload = {
    merchantOrderId,
    amount: amountInPaise,
    paymentFlow: {
      type: "PG_CHECKOUT",
      message: "Order Payment",
      merchantUrls: {
        redirectUrl,
      },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("PhonePe Create Payment Error:", errorText);
    throw new Error("Failed to create PhonePe payment");
  }

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.redirectUrl;
  } catch (parseError) {
    console.error("PhonePe create payment Parse Error:", parseError);
    console.error("Raw payment response:", text);
    throw new Error("Failed to parse PhonePe payment response");
  }
};

// to check payment status with PhonePe
export const checkPhonePeStatus = async (merchantOrderId: string) => {
  try {
    const token = await getPhonePeToken();

    const url = process.env.PHONEPE_ENV === "PROD"
      ? `https://api.phonepe.com/apis/pg/checkout/v2/order/${merchantOrderId}/status`
      : `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${merchantOrderId}/status`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
      console.error(`PhonePe status check failed for order ${merchantOrderId}: ${res.status} ${res.statusText}`);
      return false;
    }

    const text = await res.text();
    if (!text) {
      console.warn(`PhonePe returned empty response for order ${merchantOrderId}`);
      return false;
    }

    try {
      const data = JSON.parse(text);
      return data.state === "COMPLETED";
    } catch (parseError) {
      console.error(`PhonePe JSON parse error for order ${merchantOrderId}:`, parseError);
      console.error(`Raw response:`, text);
      return false;
    }
  } catch (error) {
    console.error("Error checking PhonePe status:", error);
    return false;
  }
};
