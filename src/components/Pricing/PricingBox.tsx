"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Next.js 13+ uses next/navigation
import React, { useEffect, useState } from "react";
import OfferList from "./OfferList";
import { Price } from "@/types/price";

const PricingBox = ({ product }: { product: Price }) => {
  const { data: session } = useSession(); // Get the session object
  const router = useRouter(); // Get router object instance

  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (session) {
      // Check for session.user.id and use it to fetch subscription status
      axios
        .get("/api/payment/subscription")
        .then((res) => setIsSubscribed(res.data.isSubscribed))
        .catch((err) => {
          console.error("Error fetching subscription status", err);
          setIsSubscribed(false);
        });
    }
  }, [session]);
  

  const handleSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!session?.user?.id) {
      router.push("/signin");
      return;
    }

    try {
      const response = await axios.post("/api/payment", {
        priceId: product.id,
        userId: session.user.id, // Ensure the userId is passed
      });
      if (response.data.url) {
        window.location.assign(response.data.url);
      } else {
        console.error("Error: No URL received from the server", response.data);
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/3">
      <div
        className="relative z-10 mb-10 overflow-hidden rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14"
        data-wow-delay=".1s"
      >
        {product.nickname === "Premium" && (
          <p className="absolute right-[-45px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-primary px-5 py-2 text-base font-medium text-white">
            Recommended
          </p>
        )}
        <span className="mb-5 block text-2xl font-semibold text-dark dark:text-white">
          {product.nickname}
        </span>
        <h2 className="mb-6 text-5xl font-bold text-dark dark:text-white xl:text-[42px] xl:leading-[1.25]">
          <span className="text-2xl font-medium text-dark dark:text-white">$ </span>
          <span className="-ml-1 text-4xl font-semibold">
            {(product.unit_amount / 100).toLocaleString("en-US", {
              currency: "USD",
            })}
          </span>
          <span className="text-lg font-normal text-body-color dark:text-dark-6">
            {" "}
            Per Month
          </span>
        </h2>

        <div className="mb-8">
          <h3 className="mb-5 text-xl font-medium text-dark dark:text-white">
            Features
          </h3>
          <div className="mb-10">
            {product?.offers.map((offer, i) => (
              <OfferList key={i} text={offer} />
            ))}
          </div>
        </div>
        <div className="w-full">
          {/* Disable the button if the user is already subscribed */}
          <button
            onClick={handleSubscription}
            className={`inline-block rounded-lg bg-primary px-8 py-4 text-center text-base font-semibold text-white transition duration-300 hover:bg-primary/90 ${
              isSubscribed ? "cursor-not-allowed bg-gray-300" : ""
            }`}
            disabled={isSubscribed} // Disable the button if the user is already subscribed
          >
            {isSubscribed
              ? "Already Subscribed"
              : session
              ? "Subscribe Now"
              : "Sign In to Subscribe"}
          </button>
        </div>
      </div>
    </div>

  );
};

export default PricingBox;
