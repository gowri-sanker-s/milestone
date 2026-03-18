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

  const data = await res.json();
  return data.access_token;
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

  const data = await res.json();
  return data.redirectUrl;
};

// to check payment status with PhonePe
export const checkPhonePeStatus = async (merchantOrderId: string) => {
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
  });

  if (!res.ok) {
    return false;
  }

  const data = await res.json();
  return data.state === "COMPLETED";
};
