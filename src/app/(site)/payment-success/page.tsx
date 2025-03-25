"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const SuccessPayment = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    if (sessionId) {
      axios
        .get(`/api/payment/session?session_id=${sessionId}`)
        .then((res) => setCustomerEmail(res.data.customer_email))
        .catch((err) => console.error("Error fetching session:", err));
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">Payment Successful! 🎉</h2>
        <p className="mt-2 text-gray-600">Thank you for your purchase!</p>
        {customerEmail && <p className="mt-1 text-gray-500">A receipt has been sent to: {customerEmail}</p>}
        <a href="/" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md">
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default SuccessPayment;
