'use client';
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState<{ name: string; email: string; id: string; role: string } | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      const { name, value } = e.target;
      setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
    }
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="shadow-lg p-4 rounded-lg flex flex-col justify-center gap-y-2 w-full max-w-md">
        <h1 className="font-bold text-xl">Edit User:</h1>
          <p>Id:</p>
          {user && <Input type="text" placeholder="ID" value={user.id} readOnly  />}
          <p>Name:</p>
          {user && <Input type="text" name="name" placeholder="name" value={user.name} onChange={handleChange} />}
          <p>Email:</p>
            {user && <Input type="text" name="email" placeholder="Email" value={user.email} onChange={handleChange}/>}
          <p>Role:</p>
          {user && <Input type="text" name="role" placeholder="Role" value={user.role} onChange={handleChange}/>}
          <div className="flex justify-center items-center">
          <button className="bg-blue-600 text-white hover:bg-blue-300 rounded-lg w-1/2 p-2">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
