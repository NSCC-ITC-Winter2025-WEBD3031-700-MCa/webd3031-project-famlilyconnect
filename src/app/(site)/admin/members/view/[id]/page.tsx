'use client';
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";



export default function ViewUser() {
  const { id } = useParams();
  const [user, setUser] = useState<{ name: string; email: string; id: string; role: string; isPremium: boolean } | null>(null);
  const [familyMembers, setFamilyMembers] = useState<Array<{ id: string; userId: string; familyId: string; role: string; isMainFamily: boolean } | null>>([]);
  const [userPosts, setUserPosts] = useState<Array<{ id: string; content: string; authorId: string; familyId: string; createdAt: Date } | null>>([]);
  const [photos, setPhotos] = useState<Array<{ id: string; url: string; uploaderId: string; familyId: string; createdAt: Date } | null>>([]);
  const [family, setFamily] = useState<Array<{ id: string; name: string; } | null>>([]);

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

  // fetch user photos from database
  useEffect(() => {
    if(!id) return;
    async function fetchUserPhotos() {
      try{
        const res = await fetch(`/api/members/${id}/userphotos`);
        if(!res.ok) throw new Error("Failed to fetch user photos");
        const data = await res.json();
        setPhotos(data);
      }catch(error){
        console.error("Error fetching user photos:", error);
      }
    }
    fetchUserPhotos();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    async function fetchFamily() {
      try {
        const res = await fetch(`/api/members/${id}/family`);
        if (!res.ok) throw new Error("Failed to fetch family");
        const data = await res.json();
        setFamily(data);
      } catch (error) {
        console.error("Error fetching family:", error);
      }
    }
    fetchFamily();
  }, [id]);

  return (
    <div className="overflow-x-hidden bg-white shadow-lg">
    {/* user data  */}
    <div className="grid grid-cols-2 gap-1 w-[100%]mt-2">

  {user ? (
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
      <table className="w-auto mt-4 border-collapse border border-gray-200 shadow-lg">
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
          <tr className="border-b">
            <td className="px-4 py-2 font-medium text-gray-600">Role</td>
            <td className="px-4 py-2 text-gray-900">{user.role}</td>
          </tr>
          <tr>
          <td className="px-4 py-2 font-medium text-gray-600">Premium Member</td>
          <td className="px-4 py-2 text-gray-900">{user.isPremium ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>
    </div>
) : (
  <p className="text-center text-gray-500">Loading user data...</p>
)}

{/* family member data  */}
{familyMembers.length > 0 ? (
  familyMembers.map((familyMember) => familyMember && (
    <div key={familyMember.id}>
      <div className="px-6 py-4 ">
        <h2 className="text-xl font-semibold text-gray-800">Family Member</h2>
        <table className="mt-4 border-collapse border border-gray-200 shadow-lg">
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
{/* family data  */}
{family.length > 0 ? (
  <div className="px-6 py-4">
    <h2 className="text-xl font-semibold text-gray-800">Family Details</h2>
    <table className="mt-4 border-collapse border border-gray-200 shadow-lg">
      <tbody>
        {family.map((fam) => fam && (
          <tr key={fam.id} className="border-b">
          <tr className="border-b">
            <td className="px-4 py-2 font-medium text-gray-600">Family ID</td>
            <td className="px-4 py-2 text-gray-900">{fam.id}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-medium text-gray-600">Family Name</td>
            <td className="px-4 py-2 text-gray-900">{fam.name}</td>
          </tr>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-center text-gray-500">Loading family data...</p>
)}
</div>




{/* user posts data  */}
{userPosts.length > 0 ? (
  <div className="w-[100%] bg-white shadow-lg rounded-lg overflow-hidden mt-2 p-2">
<div className="">
        <h2 className="text-xl font-semibold text-gray-800 ps-3">Posts</h2>
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
            {userPosts.map((userPost) => userPost && (
            <tr key={userPost.id} className="border-b">
              <td className="px-4 py-2 text-gray-900">{userPost.id}</td>
              <td className="px-4 py-2 text-gray-900">{userPost.content}</td>
              <td className="px-4 py-2 text-gray-900">{userPost.authorId}</td>
              <td className="px-4 py-2 text-gray-900">{userPost.familyId}</td>
              <td className="px-4 py-2 text-gray-900 text-end">{userPost.createdAt.toLocaleString()}</td>
            </tr>
            ))}
          </tbody>
      
        </table>
      </div>
    </div>
) : (
  <p className="text-center text-gray-500">Loading user posts data...</p>
)}

{/* user photos data */}
{photos.length > 0 ? (
    <div className="w-[100%] bg-white shadow-lg rounded-lg mt-2">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">User Photos</h2>

        {/* Wrapping the table with a div that makes it horizontally scrollable */}
        <div className="overflow-x-auto">
          <table className="mt-4 border-collapse border border-gray-200">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 font-medium text-gray-600">URL</th>
                <th className="px-4 py-2 font-medium text-gray-600">Uploader ID</th>
                <th className="px-4 py-2 font-medium text-gray-600">Family ID</th>
                <th className="px-4 py-2 font-medium text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody>
              {photos.map(photo => photo && (
                <tr key={photo.id} className="border-b">
                <td className="px-4 py-2 text-gray-900">{photo.id}</td>
                <td className="px-4 py-2 text-gray-900 break-words max-w-[200px]">{photo.url}</td>
                <td className="px-4 py-2 text-gray-900">{photo.uploaderId}</td>
                <td className="px-4 py-2 text-gray-900">{photo.familyId}</td>
                <td className="px-4 py-2 text-gray-900">{new Date(photo.createdAt).toLocaleString()}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-500">Loading user photos data...</p>
  )}


    </div>
  );
}
