import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // Import shared Stripe instance
// import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth"; // Import getServerSession from next-auth
import { authOptions } from '@/utils/auth'; // Import your auth options
import { prisma } from "@/utils/prismaDB";


export async function POST(request: NextRequest) {
  const data = await request.json();
  const priceId = data.priceId;
  
  // Get Session (works with JWT because you've extended the token correctly)
  const session = await getServerSession(authOptions); // Get the session object from next-auth

  if(!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized. User ID not found in session." },
      { status: 401 }
    );
  }
  const user = session.user.id; // Extract user information from the session
  const userEmail = session.user.email; // Extract user email from the session

  if (!userEmail) {
    return NextResponse.json(
      { error: "Email not found in session." },
      { status: 400 }
    );
  }

  // const existingSubscription = await prisma.subscription.findUnique({
  //   where: { userId: user },
  // });

  // if (existingSubscription) {
  //   return NextResponse.json(
  //     { error: "You already have an active subscription." },
  //     { status: 400 }
  //   );
  // }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Supports Google Pay & Apple Pay
      line_items: [
        {
          price: priceId,
          quantity: 1,
        }
      ],
      mode: "subscription",
      success_url: `${process.env.SITE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/payment-failed`,
      customer_email: userEmail!, // Optional: Pre-fill email for the customer
      metadata: {
        userId: user, // Replace with actual user ID from your database
        priceId: priceId, // Optional: Include price ID in metadata
      },
      
    });
    console.log("UserId:", user);
    console.log("PriceId:", priceId);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("x Error creating checkout session:", error.message);
    // Handle error appropriately (e.g., log it, send a response, etc.)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}