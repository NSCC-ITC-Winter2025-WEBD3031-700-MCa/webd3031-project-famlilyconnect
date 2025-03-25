import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Import shared Stripe instance

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ customer_email: session.customer_email });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
