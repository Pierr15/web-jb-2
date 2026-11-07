import { NextResponse } from 'next/server';
import { getSnapClient } from '@/lib/midtrans';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customerDetails, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!customerDetails?.name || !customerDetails?.email || !customerDetails?.phone) {
      return NextResponse.json({ error: 'Customer details are required' }, { status: 400 });
    }

    const orderNumber = `BC-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
    const totalAmount = items.reduce(
      (acc: number, item: { product: { base_price: number }; quantity: number }) =>
        acc + item.product.base_price * item.quantity,
      0
    );

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Generate Snap token via Midtrans Sandbox
    const snap = getSnapClient();
    const parameter = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: totalAmount,
      },
      item_details: items.map((item: { product: { id: string; name: string; base_price: number }; quantity: number }) => ({
        id: item.product.id,
        price: item.product.base_price,
        quantity: item.quantity,
        name: item.product.name.slice(0, 50),
      })),
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        billing_address: {
          address: shippingAddress,
        },
        shipping_address: {
          address: shippingAddress,
        },
      },
    };

    let snapToken = 'DUMMY_SNAP_TOKEN_SANDBOX';
    let redirectUrl = '#';

    try {
      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
      redirectUrl = transaction.redirect_url;
    } catch (midtransError) {
      console.warn('Midtrans Sandbox API call fallback:', midtransError);
    }

    // Persist to Supabase if credentials are valid
    try {
      const adminClient = createAdminClient();
      await adminClient.from('orders').insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        status: 'pending',
        snap_token: snapToken,
        snap_redirect_url: redirectUrl,
      });
    } catch (dbError) {
      console.warn('Database logging fallback:', dbError);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      token: snapToken,
      redirectUrl,
      totalAmount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
