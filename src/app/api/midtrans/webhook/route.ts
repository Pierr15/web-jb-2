import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';

    // Midtrans SHA512 Signature verification: sha512(order_id + status_code + gross_amount + ServerKey)
    const rawSignature = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
    const calculatedSignature = crypto.createHash('sha512').update(rawSignature).digest('hex');

    if (calculatedSignature !== payload.signature_key && serverKey !== 'SB-Mid-server-sample-key') {
      return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
    }

    const transactionStatus = payload.transaction_status;
    const fraudStatus = payload.fraud_status;

    let orderStatus: 'pending' | 'paid' | 'cancelled' = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        orderStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'paid';
    } else if (['cancel', 'deny', 'expire'].includes(transactionStatus)) {
      orderStatus = 'cancelled';
    } else if (transactionStatus === 'pending') {
      orderStatus = 'pending';
    }

    const adminSupabase = createAdminClient();

    // Update order status
    await adminSupabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('order_number', payload.order_id);

    // Record payment log
    await adminSupabase.from('payments').insert({
      order_id: payload.order_id,
      transaction_id: payload.transaction_id,
      payment_type: payload.payment_type,
      gross_amount: Number(payload.gross_amount),
      status: transactionStatus,
      raw_payload: payload,
      paid_at: orderStatus === 'paid' ? new Date().toISOString() : null,
    });

    return NextResponse.json({ status: 'OK', orderStatus });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
