import { NextRequest, NextResponse } from "next/server";
import { createCashfreeOrder } from "@/lib/cashfree";
import { generateOrderNumber } from "@/lib/utils";
import { createServiceRoleClient, createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shipping_address,
      payment_method,
      coupon_code,
      guest_email,
      guest_phone,
      notes,
    } = body;

    // Validate required fields
    if (!items || !items.length || !shipping_address || !payment_method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const supabase = await createServiceRoleClient();
    const userClient = await createServerSupabaseClient();
    const { data: { user } } = await userClient.auth.getUser();

    // Calculate totals server-side
    const productIds = items.map((i: any) => i.product_id);
    const { data: products } = await supabase.from("products").select("id, title, sale_price, base_price").in("id", productIds);
    
    let serverTotal = 0;
    const orderItemsToInsert = items.map((item: any) => {
      const product = products?.find(p => p.id === item.product_id);
      const price = product ? (product.sale_price || product.base_price) : 0;
      serverTotal += price * item.quantity;
      return {
        product_id: item.product_id,
        product_title: product?.title || "Unknown Product",
        quantity: item.quantity,
        unit_price: price,
        total_price: price * item.quantity,
        variant_info: item.size || null,
      };
    });

    // Add COD fee if applicable
    if (payment_method === "cod") {
      serverTotal += 49;
    }

    // Create order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        guest_email: guest_email || null,
        guest_phone: guest_phone || shipping_address.phone,
        status: "pending",
        subtotal: serverTotal - (payment_method === "cod" ? 49 : 0),
        shipping_amount: 0,
        total: serverTotal,
        payment_method,
        shipping_address,
        billing_address: shipping_address,
        notes: notes || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert.map((item: any) => ({ ...item, order_id: orderData.id })));

    if (itemsError) throw itemsError;

    if (payment_method === "prepaid") {
      // Create Cashfree payment session
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin") || "https://printmacha.onrender.com";
        
        const cashfreeOrder = await createCashfreeOrder({
          orderId: orderNumber,
          orderAmount: serverTotal,
          customerName: shipping_address.full_name || "Guest User",
          customerEmail: guest_email || "customer@printmacha.com",
          customerPhone: guest_phone || shipping_address.phone || "9999999999",
          returnUrl: `${siteUrl}/checkout/success`,
        });

        return NextResponse.json({
          success: true,
          order_number: orderNumber,
          payment_session_id: cashfreeOrder.payment_session_id,
          cf_order_id: cashfreeOrder.cf_order_id,
        });
      } catch (error: any) {
        console.error("Cashfree order creation failed:", error);
        return NextResponse.json(
          { error: "Payment initiation failed", details: error?.message || String(error) },
          { status: 500 }
        );
      }
    } else {
      // COD order
      // TODO: Create order with cod_pending payment status
      return NextResponse.json({
        success: true,
        order_number: orderNumber,
        payment_method: "cod",
      });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
