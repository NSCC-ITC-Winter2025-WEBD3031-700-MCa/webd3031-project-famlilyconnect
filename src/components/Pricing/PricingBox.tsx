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
        className="relative z-10 mb-10 overflow-hidden rounded-xl bg-white px-8 py-10 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.08)] dark:bg-dark-2 sm:p-12 lg:px-6 lg:py-10 xl:p-14"
        data-wow-delay=".1s"
      >
        {product.nickname === "Premium" && (
          <p className="absolute right-[-45px] top-[60px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-primary px-5 py-2 text-base font-medium text-white">
            Recommended
          </p>
        )}
        {product.nickname === "Basic" && (
          <p className="absolute right-[-10px] top-[20px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-green-500 px-5 py-2 text-base font-medium text-white">
            Free
          </p>
        )}
        {product.nickname === "Business" && (
          <p className="absolute right-[-20px] top-[30px] inline-block -rotate-90 rounded-bl-md rounded-tl-md bg-yellow-500 px-5 py-2 text-base font-medium text-white">
            Business
          </p>
        )}
        <span className="mb-5 block text-xl font-medium text-dark dark:text-white">
          {product.nickname}
        </span>
        <h2 className="mb-11 text-4xl font-semibold text-dark dark:text-white xl:text-[42px] xl:leading-[1.21]">
          <span className="text-xl font-medium">$ </span>
          <span className="-ml-1 -tracking-[2px]">
            {(product.unit_amount / 100).toLocaleString("en-US", {
              currency: "USD",
            })}
          </span>
          <span className="text-base font-normal text-body-color dark:text-dark-6">
            {" "}
            Per Month
          </span>
        </h2>

        <div className="mb-[50px]">
          <h3 className="mb-5 text-lg font-medium text-dark dark:text-white">
            Features
          </h3>
          <div className="mb-10">
            {product?.offers.map((offer, i) => (
              <OfferList key={i} text={offer} />
            ))}
          </div>
        </div>
        <div className="w-full">
           {/* Disable the button if user is already subscribed */}
          <button
            onClick={handleSubscription}
            className={`inline-block rounded-md bg-primary px-7 py-3 text-center text-base font-medium text-white transition duration-300 hover:bg-primary/90 ${
              isSubscribed ? "cursor-not-allowed bg-gray-300" : ""
            }`}
            disabled={isSubscribed} // Disable the button if the user is already subscribed
          >
            {isSubscribed ? "Already Subscribed" : session ? "Subscribe" : "Sign In to Subscribe"}
            {/* Purchase Now */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingBox;
