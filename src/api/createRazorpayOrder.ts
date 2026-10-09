import { getServerUserSession } from "../helpers/getServerUserSession";

export async function handle(request: Request) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);

    if (!Number.isInteger(amount) || amount < 150 || amount > 2000) {
      return Response.json(
        { error: "રકમ ₹150 થી ₹2000 વચ્ચે હોવી જોઈએ." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return Response.json(
        { error: "Payment Gateway સેટઅપ બાકી છે." },
        { status: 503 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount * 100,
        currency: "INR",
        receipt: `GC${Date.now()}`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "Payment Order બનાવી શકાયો નથી." },
        { status: 502 }
      );
    }

    return Response.json({
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId
    });
  } catch {
    return Response.json(
      { error: "Payment બનાવવામાં ભૂલ થઈ." },
      { status: 400 }
    );
  }
}
