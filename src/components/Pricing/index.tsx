"use client";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "./PricingBox";
import { pricingData } from "@/stripe/pricingData";
import Link from "next/link";

const Pricing = () => {
  return (
    <section
  id="pricing"
  className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]"
>
  <div className="container">
    {/* Section Title */}
    <div className="mb-[60px] text-center">
      <SectionTitle
        subtitle="Flexible and Transparent Pricing"
        title="Choose a Plan That Works for Your Family"
        paragraph="Family Connect offers plans tailored to different needs. Whether you're looking for a simple way to stay in touch or a full-featured platform for family management, we've got you covered."
        center
      />
    </div>

    {/* Pricing Cards */}
    <div className="flex flex-col items-center gap-10 md:flex-row md:justify-center">
      {pricingData.map((product, index) => (
        <PricingBox key={index} product={product} />
      ))}
    </div>

    {/* Call to Action */}
    <div className="mt-20 text-center">
      <h2 className="mb-4 text-3xl font-semibold text-dark dark:text-white">
        Need a Custom Plan?
      </h2>
      <p className="mb-8 text-base text-body-color dark:text-dark-6">
        Contact us for custom pricing and features tailored to your needs.
      </p>
      <Link
        href="/contact"
        className="inline-block rounded-md bg-primary px-8 py-4 text-center text-base font-semibold text-white transition duration-300 hover:bg-primary/90 shadow-lg"
      >
        Contact Us
      </Link>
    </div>
  </div>
</section>

  );
};

export default Pricing;
