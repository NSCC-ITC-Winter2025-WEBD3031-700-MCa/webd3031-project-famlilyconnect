import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Ensure this imports your initialized Stripe instance
import Stripe from "stripe";
import { Readable } from "stream";
import { prisma } from "@/utils/prismaDB"; // Import your Prisma client instance

// Stripe requires raw body parsing
export const config = {
  api: { bodyParser: false },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//Helper function to convert a Readable stream to a string
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}


export async function POST(req: Request) {
  const rawBody = await req.text(); // raw body for stripe signature
  const sig = req.headers.get('stripe-signature') as string;

  

  let event: Stripe.Event;
  console.log("Received Stripe webhook event:", rawBody);

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log("Event", event);
  } catch (err: any) {
    console.error("⚠️ Webhook verification failed:", err.message);
    // return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  // ✅ Handle subscription creation
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;


    console.log("Session Data:", session);
    const subscriptionId = session.subscription as string;
    const userId = session.metadata?.userId;
    const priceId = session.metadata?.priceId;

    if (!subscriptionId || !userId || !priceId) {
      console.error("Missing subscription ID or metadata.");
      return new NextResponse("Missing data", { status: 400 });
    }

    try {
      // subscription object from Stripe
      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

      console.log("Stripe Subscription:", stripeSub);    

      // Save subscription in DB
      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        update: {
          status: stripeSub.status,
          priceId,
          startDate: new Date(stripeSub.start_date * 1000),
          endDate: new Date(stripeSub.current_period_end * 1000),
        },
        create: {
          userId,
          stripeSubscriptionId: subscriptionId,
          status: stripeSub.status,
          priceId,
          startDate: new Date(stripeSub.start_date * 1000),
          endDate: new Date(stripeSub.current_period_end * 1000),
        },
      });

      // ✅ Update the user to set isPremium = true
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: true },
      });

      console.log("✅ Subscription saved successfully");

      return NextResponse.json({ received: true });
    } catch (err: any) {
      console.error("❌ Error saving subscription:", err.message);
      return new NextResponse("Failed to save subscription", { status: 500 });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
  
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: subscription.status, // should be "canceled"
      },
    });
  
    return NextResponse.json({ received: true });
  }

  return new NextResponse("Unhandled event type", { status: 200 });
}