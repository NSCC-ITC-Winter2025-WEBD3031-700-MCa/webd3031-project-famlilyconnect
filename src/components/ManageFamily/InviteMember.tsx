"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail } from "@/utils/validateEmail"; 
import Loader from "@/components/Common/Loader"; 
import { useSession } from 'next-auth/react';

interface InviteMemberProps {
  creatorFamilyId: string;
}

const InviteMember = ({ creatorFamilyId }: InviteMemberProps) => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const { data: session } = useSession() as { data: { user: { id: string } } | null };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter an email address.");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address.");
    }

    setLoader(true);

    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          familyId: creatorFamilyId,
          inviterId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send invitation");
      }

      toast.success("Invitation sent successfully!");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error sending invitation");
    } finally {
      setLoader(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-[22px]">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Invite Member</h3>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
        />
      </div>
      <div className="mb-9">
        <button
          type="submit"
          disabled={loader}
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-80"
        >
          Send Invitation {loader && <Loader />}
        </button>
      </div>
    </form>
  );
};

export default InviteMember;