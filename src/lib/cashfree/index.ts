// ============================================
// Cashfree Payment Gateway Integration
// ============================================

interface CreateOrderPayload {
  orderId: string;
  orderAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
}

interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
}

const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-client-id': process.env.CASHFREE_APP_ID!,
  'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
  'x-api-version': '2023-08-01',
});

// Create order on Cashfree
export async function createCashfreeOrder(payload: CreateOrderPayload): Promise<CashfreeOrderResponse> {
  const response = await fetch(`${CASHFREE_BASE_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      order_id: payload.orderId,
      order_amount: payload.orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: payload.orderId,
        customer_name: payload.customerName,
        customer_email: payload.customerEmail,
        customer_phone: payload.customerPhone,
      },
      order_meta: {
        return_url: payload.returnUrl + '?order_id={order_id}',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cashfree order creation failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Verify payment status
export async function verifyCashfreePayment(orderId: string) {
  const response = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}/payments`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cashfree payment verification failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Get order status
export async function getCashfreeOrderStatus(orderId: string) {
  const response = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Cashfree order status fetch failed: ${JSON.stringify(error)}`);
  }

  return response.json();
}

// Verify webhook signature
export function verifyCashfreeWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  // Cashfree webhook verification using HMAC
  const crypto = require('crypto');
  const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET!;
  
  const signatureData = timestamp + rawBody;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signatureData)
    .digest('base64');

  return signature === expectedSignature;
}
