'use client';
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "next";



export default function ViewUser() {
  const { id } = useParams();
  const [user, setUser] = useState<{ name: string; email: string; id: string; role: string } | null>(null);
  const [familyMembers, setFamilyMembers] = useState<Array<{ id: string; userId: string; familyId: string; role: string; isMainFamily: boolean } | null>>([]);
  const [userPosts, setUserPosts] = useState<Array<{ id: string; content: string; authorId: string; familyId: string; createdAt: Date } | null>>([]);

  // fetch user data from database 
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

  // fetch family member data from database
  useEffect(() => {
    if(!id) return;
    async function fetchFamilyMember() {
      try{
        const res = await fetch(`/api/members/${id}/familymember`);
        if(!res.ok) throw new Error("Failed to fetch family member");
        const data = await res.json();
        setFamilyMembers(data);
      }catch(error){
        console.error("Error fetching family member:", error);
      }
  }
    fetchFamilyMember();
  }, [id]);

  // fetch user posts from database
  useEffect(() => {
    if(!id) return;
    async function fetchUserPosts() {
      try{
        const res = await fetch(`/api/members/${id}/userposts`);
        if(!res.ok) throw new Error("Failed to fetch user posts");
        const data = await res.json();
        setUserPosts(data);
      }catch(error){
        console.error("Error fetching user posts:", error);
      }
  }
    fetchUserPosts();
  }, [id]);

  return (
    <>
    {/* user data  */}
    
  {user ? (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
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

{/* family member data  */}
{familyMembers.length > 0 ? (
  familyMembers.map((familyMember) => familyMember && (
    <div key={familyMember.id} className="w-full bg-white shadow-lg rounded-lg overflow-hidden mt-2">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Family Member</h2>
        <table className="w-full mt-4 border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">ID</td>
              <td className="px-4 py-2 text-gray-900">{familyMember.id}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">User ID</td>
              <td className="px-4 py-2 text-gray-900">{familyMember.userId}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">Family ID</td>
              <td className="px-4 py-2 text-gray-900">{familyMember.familyId}</td>
            </tr>
            <tr className="border-b">
              <td className="px-4 py-2 font-medium text-gray-600">Role</td>
              <td className="px-4 py-2 text-gray-900">{familyMember.role}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-600">Main Family</td>
              <td className="px-4 py-2 text-gray-900">{familyMember.isMainFamily ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-500">Loading family member data...</p>
)}

{/* user posts data  */}
{userPosts.length > 0 ? (
  userPosts.map((userPost) => userPost && (
    <div key={userPost.id} className="w-full bg-white shadow-lg rounded-lg overflow-hidden mt-2">
<div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Posts</h2>
        <table className="w-full mt-4 border-collapse border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 font-medium text-gray-600 text-start">Post ID</th>
              <th className="px-4 py-2 font-medium text-gray-600 text-start">Content</th>
              <th className="px-4 py-2 font-medium text-gray-600 text-start">User ID</th>
              <th className="px-4 py-2 font-medium text-gray-600 text-start">Family ID</th>
              <th className="px-4 py-2 font-medium text-gray-600 text-end">Date Created</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-4 py-2 text-gray-900">{userPost.id}</td>
              <td className="px-4 py-2 text-gray-900">{userPost.content}</td>
              <td className="px-4 py-2 text-gray-900">{userPost.authorId}</td>
              <td className="px-4 py-2 text-gray-900">{userPost.familyId}</td>
              <td className="px-4 py-2 text-gray-900 text-end">{userPost.createdAt.toLocaleString()}</td>
            </tr>
          </tbody>
      
        </table>
      </div>
    </div>
  ))
) : (
  <p className="text-center text-gray-500">Loading user posts data...</p>
)}


    </>
  );
}
