"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail } from "@/utils/validateEmail"; 
import Loader from "@/components/Common/Loader"; 
import { useSession } from 'next-auth/react'; 
import { on } from "events";

interface InviteMemberProps {
  creatorFamilyId: string;
  onInviteMember: (email:string) => void;
}


const InviteMember = ({ creatorFamilyId, onInviteMember }: InviteMemberProps) => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const { data: session } = useSession() as { data: { user: { id: string } } | null };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter an email address.");
    }

    setLoader(true);

    if (!validateEmail(email)) {
      setLoader(false);
      return toast.error("Please enter a valid email address.");
    }

 
    fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        familyId: creatorFamilyId,
        inviterId: session?.user?.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Invitation sent successfully") {
          toast.success("Invitation sent successfully!");
          onInviteMember(email);
          setEmail(""); 
        } else {
          toast.error("Failed to send invitation.");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error sending invitation.");
      })
      .finally(() => {
        setLoader(false);
      });
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
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
        >
          Send Invitation {loader && <Loader />}
        </button>
      </div>
    </form>
  );
};

export default InviteMember;
