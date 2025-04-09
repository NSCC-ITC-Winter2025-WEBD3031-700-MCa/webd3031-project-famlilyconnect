import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Ensure this imports your initialized Stripe instance
import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/utils/prismaDB"; // Import your Prisma client instance

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Stripe secret key and webhook secret set in your environment variables

export async function POST(req: NextRequest) {
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



//   console.log(`✅ Received event: ${event.type}`);

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as any; // Cast to any for TypeScript compatibility
//       console.log(`✅ Checkout session completed: ${session.id}`);
//       const userId = session.metadata?.userId; // Extract userId from metadata

//       console.log(`💰 Payment successful for User ID: ${userId}`);

//       // Update the database to mark the subscription as active
//       // Example: await updateSubscription(userId, session);
//       if (userId && session.subscription) {
//         // Fetch full subcription object from stripe
//         const stripeSubcription = await stripe.subscriptions.retrieve(session.subscription);

//         console.log(`Stripe Subscription: ${JSON.stringify(stripeSubcription)}`);
//         // Check if the subscription already exists in the database
//         const existingSubscription = await prisma.subscription.findUnique({
//           where: { stripeSubscriptionId: session.subscription },
//         });
//         if (existingSubscription) {
//           console.log(`⚠️ Subscription already exists: ${existingSubscription.id}`);
//           return NextResponse.json({ received: true });
//         }

//         // Create a new subscription in the database
//         console.log(`Creating new subscription for User ID: ${userId}`);
//         // Store the subscription ID, status, and other relevant information in your database
//         ///////////////////////////////

//         await prisma.subscription.create({
//           data: {
//             userId: userId, // Store user ID
//             // stripeCustomerId: session.customer, // Store Stripe customer ID
//             stripeSubscriptionId: stripeSubcription.id, // Store Stripe subscription ID
//             status: stripeSubcription.status,
//             priceId: stripeSubcription.items.data[0].price.id, // Store price ID
//             // price: stripeSubcription.items.data[0].price.unit_amount, // Store price amount
//             // currency: stripeSubcription.items.data[0].price.currency, // Store currency
//             // interval: stripeSubcription.items.data[0].price.recurring?.interval, // Store billing interval
//             startDate: new Date(stripeSubcription.current_period_start * 1000), // Convert to Date object
//             endDate: new Date(stripeSubcription.current_period_end * 1000), // Convert to Date object
//           },
//         });
//       }
//       break;
//     }

//     case "customer.subscription.deleted": {
//       const subscription = event.data.object as any; // Cast to any for TypeScript compatibility
//       console.log(`✅ Subscription canceled: ${subscription.id}`);
//       const userId = subscription.metadata?.userId; // Extract userId from metadata
//       console.log(`💰 Subscription canceled for User ID: ${userId}`);
      

//       // TODO: Update the database to mark the subscription as inactive
//       // Example: await cancelSubscription(subscription.customer);

//       await prisma.subscription.updateMany({
//         where: { stripeSubscriptionId: subscription.id },
//         data: { status: "canceled" }, // Update status to canceled
//       });
//       break;
//     }
//     ////////////////////////////////////////////////////
//     ////////////////////////////////////////////////////
//     case "payment_intent.canceled": {
//       const intent = event.data.object;
//       console.log(`❌ Payment intent canceled: ${intent.id}`);
//       // Optionally update DB, or log the abandoned checkout
//       break;
//     }
//     case "payment_intent.succeeded": {
//       const intent = event.data.object;
//       console.log(`✅ Payment intent succeeded: ${intent.id}`);
//       // Optionally update DB, or log the successful payment
//       break;
//     }
//     case "payment_intent.payment_failed": {
//       const intent = event.data.object;
//       console.log(`❌ Payment intent failed: ${intent.id}`);
//       // Optionally update DB, or log the failed payment
//       break;
//     }
//     case "checkout.session.async_payment_succeeded": {
//       const session = event.data.object as any; // Cast to any for TypeScript compatibility
//       console.log(`✅ Async payment succeeded: ${session.id}`);
//       // Optionally update DB, or log the successful async payment
//       break;
//     }
//     case "checkout.session.async_payment_failed": {
//       const session = event.data.object as any; // Cast to any for TypeScript compatibility
//       console.log(`❌ Async payment failed: ${session.id}`);
//       // Optionally update DB, or log the failed async payment
//       break;
//     }
//     case "customer.subscription.updated": {
//       const subscription = event.data.object as any; // Cast to any for TypeScript compatibility
//       console.log(`✅ Subscription updated: ${subscription.id}`);
//       // Optionally update DB, or log the subscription update
//       break;
//     }    
//     ////////////////////////////////////////////////////
//     ////////////////////////////////////////////////////


//     default:
//       console.warn(`❗ Unhandled event type: ${event.type}`);
//   }

//   return NextResponse.json({ received: true });
// }

// Stripe requires raw body parsing
export const config = {
  api: { bodyParser: false },
};
