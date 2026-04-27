import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/delivery-check?pincode=560001
 * 
 * Checks if delivery is available to a pincode and returns estimated delivery date.
 * Uses Shiprocket serviceability API if credentials are available,
 * otherwise uses a sensible fallback.
 */

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

// Cache token
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getShiprocketToken(): Promise<string | null> {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  try {
    const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      cachedToken = { token: data.token, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
      return data.token;
    }
  } catch {}
  return null;
}

// Metro cities get faster delivery
const METRO_PINCODES: Record<string, string> = {
  "56": "Bengaluru",
  "11": "Delhi",
  "40": "Mumbai",
  "60": "Chennai",
  "50": "Hyderabad",
  "70": "Kolkata",
  "38": "Ahmedabad",
  "41": "Pune",
  "30": "Jaipur",
  "22": "Lucknow",
};

function getFallbackEstimate(pincode: string) {
  const prefix = pincode.substring(0, 2);
  const isMetro = METRO_PINCODES[prefix];
  const pickupPrefix = process.env.SHIPROCKET_PICKUP_PINCODE?.substring(0, 2) || "56"; // Default Bengaluru
  const isSameCity = prefix === pickupPrefix;

  let minDays: number;
  let maxDays: number;

  if (isSameCity) {
    minDays = 2;
    maxDays = 4;
  } else if (isMetro) {
    minDays = 4;
    maxDays = 6;
  } else {
    minDays = 5;
    maxDays = 7;
  }

  // Add processing time (made-to-order)
  minDays += 2;
  maxDays += 2;

  const today = new Date();
  const minDate = new Date(today.getTime() + minDays * 24 * 60 * 60 * 1000);
  const maxDate = new Date(today.getTime() + maxDays * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

  return {
    available: true,
    city: isMetro || null,
    min_days: minDays,
    max_days: maxDays,
    estimated_delivery: `${formatDate(minDate)} - ${formatDate(maxDate)}`,
    cod_available: true,
    free_shipping: true, // Free above ₹999
    message: isSameCity
      ? "Same-city delivery! Usually faster."
      : isMetro
      ? "Express delivery available to metro city."
      : "Standard delivery to your area.",
  };
}

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get("pincode");

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Valid 6-digit pincode required" }, { status: 400 });
  }

  // Try Shiprocket API first
  const token = await getShiprocketToken();
  if (token) {
    try {
      const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "560001";
      const params = new URLSearchParams({
        pickup_postcode: pickupPincode,
        delivery_postcode: pincode,
        weight: "0.5",
        cod: "1",
      });

      const res = await fetch(
        `${SHIPROCKET_BASE}/courier/serviceability/?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      if (data.data?.available_courier_companies?.length > 0) {
        const couriers = data.data.available_courier_companies;
        // Find fastest and cheapest
        const sorted = couriers.sort((a: any, b: any) => a.estimated_delivery_days - b.estimated_delivery_days);
        const fastest = sorted[0];

        const today = new Date();
        const etdDate = new Date(today.getTime() + (fastest.estimated_delivery_days + 2) * 24 * 60 * 60 * 1000); // +2 for processing
        const maxDate = new Date(today.getTime() + (fastest.estimated_delivery_days + 4) * 24 * 60 * 60 * 1000);

        const formatDate = (d: Date) =>
          d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

        return NextResponse.json({
          available: true,
          city: fastest.city || null,
          min_days: fastest.estimated_delivery_days + 2,
          max_days: fastest.estimated_delivery_days + 4,
          estimated_delivery: `${formatDate(etdDate)} - ${formatDate(maxDate)}`,
          cod_available: couriers.some((c: any) => c.cod === 1),
          free_shipping: true,
          courier_count: couriers.length,
          message: `Delivery available via ${couriers.length} courier${couriers.length > 1 ? "s" : ""}`,
        });
      } else {
        // No couriers available
        return NextResponse.json({
          available: false,
          message: "Delivery not available to this pincode currently. Please try a nearby pincode.",
        });
      }
    } catch (err) {
      // Fall through to fallback
      console.error("Shiprocket serviceability error:", err);
    }
  }

  // Fallback estimate (when Shiprocket not configured)
  const estimate = getFallbackEstimate(pincode);
  return NextResponse.json(estimate);
}
