'use client';
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";



export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState<{ name: string; email: string; id: string; role: string } | null>(null);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/members/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchUser();
  }, [id]);

  // Update user data
  const updateUser = async () => {
    if (!user) return; // Ensure user data is available

    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Failed to update user");
      console.log("User updated successfully");
      router.push("/admin/members"); // Redirect to members page after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };



  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      const { name, value } = e.target;
      setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser(); // Trigger user update on form submit
  };


  return (
    <>
      <div className="flex items-center justify-center">
        <div className="shadow-lg p-4 rounded-lg flex flex-col justify-center gap-y-2 w-full max-w-md">
          <h1 className="font-bold text-xl">Edit User:</h1>
          <form onSubmit={handleSubmit}>
            <p>Id:</p>
            {user && <Input type="text" placeholder="ID" value={user.id} readOnly />}
            <p>Name:</p>
            {user && <Input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} />}
            <p>Email:</p>
            {user && <Input type="text" name="email" placeholder="Email" value={user.email} onChange={handleChange} />}
            <p>Role:</p>
            {user && <Input type="text" name="role" placeholder="Role" value={user.role} onChange={handleChange} />}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-300 rounded-lg w-1/2 p-2 mt-4"
                disabled={!user} // Disable button until user data is available
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
