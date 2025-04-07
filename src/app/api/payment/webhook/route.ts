import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Ensure this imports your initialized Stripe instance
import { headers } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Ensure you have your Stripe secret key and webhook secret set in your environment variables
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  let event;

  if (!sig || !endpointSecret) {
    console.error("⚠️ Missing signature or webhook secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rawBody = await req.text(); // Read raw request body
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook verification failed:", err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  console.log(`✅ Received event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId; // Extract userId from metadata

      console.log(`💰 Payment successful for User ID: ${userId}`);

      // TODO: Update the database to mark the subscription as active
      // Example: await updateSubscription(userId, session);
      if (userId) {
        await prisma.subscription.create({
          data: {
            userId: userId,
            stripeSubscriptionId: session.subscription, // Store Stripe subscription ID
            status: "active", // Set the status to active
            priceId: session.metadata?.priceId, // Store the price ID from metadata
            startDate: new Date(session.current_period_start * 1000), // Convert to Date object
            endDate: new Date(session.current_period_end * 1000), // Convert to Date object
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log(`🔴 Subscription canceled: ${subscription.id}`);

      // TODO: Update the database to mark the subscription as inactive
      // Example: await cancelSubscription(subscription.customer);

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "canceled" }, // Update status to canceled
      });
      break;
    }

    default:
      console.warn(`❗ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Stripe requires raw body parsing
export const config = {
  api: { bodyParser: false },
};
