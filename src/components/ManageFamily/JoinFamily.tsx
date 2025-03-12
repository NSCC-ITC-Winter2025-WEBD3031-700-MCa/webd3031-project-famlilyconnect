'use client'

import { useState } from 'react';
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';

interface JoinFamilyProps {
  onJoinFamily: (inviteCode: string) => void;
}

const JoinFamily = ({ onJoinFamily }: JoinFamilyProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoinFamily = async (e: any) => {
    e.preventDefault();

    if (!inviteCode) {
      return toast.error("Please enter the code.");
    }

    setLoading(true);

    try {
      
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Code verified! Joining family...");
        onJoinFamily(inviteCode);
        router.push(`/family/${data.familyId}`);
        
      } else {
        toast.error(data.error || "Invalid or expired code.");
      }
    } catch (error) {
      toast.error("Error during code verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold dark:text-white mb-4">Join a Family</h3>
      <input
        type="text"
        required
        placeholder="Enter Invite Code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
      />
      <button
        onClick={handleJoinFamily}
        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary mt-5 px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
      >
        {loading ? "Verifying..." : "Join Family"}
      </button>
    </div>
  );
};

export default JoinFamily;