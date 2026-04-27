/**
 * Shiprocket API Client for PrintMacha
 * 
 * Endpoints used:
 * - POST /auth/login → get token
 * - POST /orders/create/adhoc → create shipment
 * - POST /courier/assign/awb → assign courier + get AWB
 * - GET  /courier/track/awb/{awb} → track shipment
 * - POST /orders/create/return → create return shipment
 * - POST /orders/cancel → cancel order
 * - GET  /courier/serviceability → check delivery availability + rates
 */

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: { token: string; expiresAt: number } | null = null;

// ─── Auth ────────────────────────────────────────────────────────────────────

async function getToken(): Promise<string> {
  // Return cached token if still valid (tokens last 10 days but we refresh every 24h)
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD env vars are required");
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(`Shiprocket auth failed: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // refresh after 24h
  };

  return data.token;
}

async function shiprocketFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getToken();
  const res = await fetch(`${SHIPROCKET_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Shiprocket API error:", data);
    throw new Error(data.message || `Shiprocket API error: ${res.status}`);
  }
  return data;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ShiprocketOrder {
  order_id: string; // Your internal order_number
  order_date: string; // YYYY-MM-DD HH:mm
  pickup_location: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_state?: string;
  shipping_country?: string;
  shipping_phone?: string;
  order_items: {
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount?: number;
    tax?: number;
    hsn?: string;
  }[];
  payment_method: "Prepaid" | "COD";
  sub_total: number;
  length: number; // cm
  breadth: number; // cm
  height: number; // cm
  weight: number; // kg
}

export interface TrackingEvent {
  date: string;
  activity: string;
  location: string;
  status: string;
  sr_status_label: string;
}

export interface TrackingResult {
  awb: string;
  courier_name: string;
  current_status: string;
  shipment_status: string;
  etd: string;
  scans: TrackingEvent[];
  delivered_date?: string;
}

// ─── Create Order on Shiprocket ──────────────────────────────────────────────

export async function createShipment(order: ShiprocketOrder) {
  return shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// ─── Assign Courier / Get AWB ────────────────────────────────────────────────

export async function assignCourier(shipmentId: number, courierId?: number) {
  const body: any = { shipment_id: shipmentId };
  if (courierId) body.courier_id = courierId;

  return shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Check Serviceability (delivery available?) ──────────────────────────────

export async function checkServiceability(
  pickupPincode: string,
  deliveryPincode: string,
  weight: number, // kg
  cod: boolean = false
) {
  const params = new URLSearchParams({
    pickup_postcode: pickupPincode,
    delivery_postcode: deliveryPincode,
    weight: String(weight),
    cod: cod ? "1" : "0",
  });

  return shiprocketFetch(`/courier/serviceability/?${params}`);
}

// ─── Track Shipment by AWB ───────────────────────────────────────────────────

export async function trackByAwb(awb: string): Promise<TrackingResult | null> {
  try {
    const data = await shiprocketFetch(`/courier/track/awb/${awb}`);
    return data.tracking_data || null;
  } catch {
    return null;
  }
}

// ─── Track by Shiprocket Order ID ────────────────────────────────────────────

export async function trackByOrderId(orderId: string) {
  try {
    const data = await shiprocketFetch(`/courier/track?order_id=${orderId}`);
    return data;
  } catch {
    return null;
  }
}

// ─── Create Return Order ─────────────────────────────────────────────────────

export async function createReturnOrder(
  orderId: number, // Shiprocket order ID
  items: { sku: string; name: string; units: number; selling_price: number }[],
  pickupAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }
) {
  return shiprocketFetch("/orders/create/return", {
    method: "POST",
    body: JSON.stringify({
      order_id: orderId,
      order_items: items,
      pickup_customer_name: pickupAddress.name,
      pickup_address: pickupAddress.address,
      pickup_city: pickupAddress.city,
      pickup_state: pickupAddress.state,
      pickup_pincode: pickupAddress.pincode,
      pickup_phone: pickupAddress.phone,
    }),
  });
}

// ─── Cancel Order ────────────────────────────────────────────────────────────

export async function cancelShiprocketOrder(orderIds: number[]) {
  return shiprocketFetch("/orders/cancel", {
    method: "POST",
    body: JSON.stringify({ ids: orderIds }),
  });
}

// ─── Generate Label ──────────────────────────────────────────────────────────

export async function generateLabel(shipmentId: number) {
  return shiprocketFetch("/courier/generate/label", {
    method: "POST",
    body: JSON.stringify({ shipment_id: [shipmentId] }),
  });
}

// ─── Schedule Pickup ─────────────────────────────────────────────────────────

export async function schedulePickup(shipmentId: number) {
  return shiprocketFetch("/courier/generate/pickup", {
    method: "POST",
    body: JSON.stringify({
      shipment_id: [shipmentId],
    }),
  });
}

// ─── Helper: Convert DB order to Shiprocket format ───────────────────────────

export function dbOrderToShiprocket(
  order: any,
  items: any[],
  dimensions: { length: number; breadth: number; height: number; weight: number }
): ShiprocketOrder {
  const addr = order.shipping_address || {};
  const nameParts = (addr.full_name || "Customer").split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    order_id: order.order_number,
    order_date: new Date(order.created_at).toISOString().replace("T", " ").slice(0, 16),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: addr.address_line_1 || addr.address || "",
    billing_address_2: addr.address_line_2 || "",
    billing_city: addr.city || "",
    billing_pincode: String(addr.postal_code || addr.pincode || ""),
    billing_state: addr.state || "",
    billing_country: "India",
    billing_email: order.guest_email || "",
    billing_phone: addr.phone || order.guest_phone || "",
    shipping_is_billing: true,
    order_items: items.map((item) => ({
      name: item.product_title || "Product",
      sku: item.product_sku || `SKU-${item.product_id}`,
      units: item.quantity,
      selling_price: Number(item.unit_price),
    })),
    payment_method: order.payment_method === "cod" ? "COD" : "Prepaid",
    sub_total: Number(order.total),
    length: dimensions.length,
    breadth: dimensions.breadth,
    height: dimensions.height,
    weight: dimensions.weight,
  };
}
