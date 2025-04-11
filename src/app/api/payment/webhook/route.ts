import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Ensure this imports your initialized Stripe instance
import Stripe from "stripe";
import { prisma } from "@/utils/prismaDB"; // Import your Prisma client instance


export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body for stripe signature
  const sig = req.headers.get("stripe-signature") as string; // Get the Stripe signature from the request headers
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Stripe secret key and webhook secret set in your environment variables

  let event: Stripe.Event;
  console.log("Received Stripe webhook event:", body);

  // if (!sig || !endpointSecret) {
  //   console.error("⚠️ Missing signature or webhook secret");
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("Event", event);
  } catch (err: any) {
    console.error("⚠️ Webhook verification failed:", err.message);
    // return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
      // headers: {
      //   "Content-Type": "application/json",
      // },
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
      // Get the subscription object from Stripe
      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
      // Retrieve subscription details if needed
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

      // Now, update the `isPremium` field in the User model
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: true }, // Set `isPremium` to `true` when user subscribes
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

// Stripe requires raw body parsing
export const config = {
  api: { bodyParser: false },
};