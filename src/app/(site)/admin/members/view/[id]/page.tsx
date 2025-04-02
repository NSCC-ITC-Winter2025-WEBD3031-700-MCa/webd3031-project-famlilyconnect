'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ViewUser() {
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

  return (
    <>
   {user ? (
  <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2 font-medium text-gray-600">ID</td>
            <td className="px-4 py-2 text-gray-900">{user.id}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-medium text-gray-600">Name</td>
            <td className="px-4 py-2 text-gray-900">{user.name}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 font-medium text-gray-600">Email</td>
            <td className="px-4 py-2 text-gray-900">{user.email}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-medium text-gray-600">Role</td>
            <td className="px-4 py-2 text-gray-900">{user.role}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
) : (
  <p className="text-center text-gray-500">Loading user data...</p>
)}

    </>
  );
}
