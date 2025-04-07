// import { Link } from "lucide-react";
import Link from 'next/link';

const CancelPayment = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold text-red-600">Payment Canceled ❌</h2>
        <p className="mt-2 text-gray-600">Your payment was not completed.</p>
        <Link href="/pricing" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md">
          Try Again
        </Link> 
        {/* <a href="/pricing" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md">
          Try Again
        </a> */}
      </div>
    </div>
  );
};

export default CancelPayment;
