"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
// import { Link } from "lucide-react";
import Link from 'next/link';

const SuccessPayment = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionId) {
      axios
        .get(`/api/payment/session?session_id=${sessionId}`)
        .then((res) => {
          setCustomerEmail(res.data.customer_email);
        })
        .catch((err) => {
          console.error("Error fetching session:", err);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(true);
    }
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold text-green-600">Payment Successful! 🎉</h2>
        <p className="mt-2 text-gray-600">Thank you for your purchase!</p>

        {loading && (
          <p className="text-gray-400 mt-4">Fetching receipt details...</p>
        )}

        {!loading && error && (
          <p className="text-red-500 mt-2">
            We couldn't confirm your session. Please check your email or contact support.
          </p>
        )}

        {!loading && !error && customerEmail && (
          <p className="mt-1 text-gray-500">
            A receipt will be sent to you shortly: <strong>{customerEmail}</strong>
          </p>
        )}

        <Link
          href="/family"
          className="mt-6 inline-block bg-primary text-white px-6 py-2 rounded-md"
        >
          <span className="ml-2">Go to Family Page</span>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPayment;
