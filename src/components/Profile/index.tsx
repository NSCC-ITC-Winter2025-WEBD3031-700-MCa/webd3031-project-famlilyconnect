'use client';
import { useUserContext } from "@/context/UserContext";
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { notFound, useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteAccount from "../DeleteAccount";




const getUserDetails = async (id: string) => {
  try {
    const res = await fetch(`/api/profile/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  }
};

type UserInfo = {
  name: string;
  email: string;
  image: string;
  familyGroups: { id: string; name: string }[];
  familyMembers: {
    role: string;
    isMainFamily: boolean;
    family: {
      id: string;
      name: string;
      _count: {
        members: number;
      };
    };
  }[];
};


export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session, update } = useSession();
  const { username, userEmail, setUsername, profileImage, setProfileImage } = useUserContext();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  useEffect(()=>{
    if (!id) return;
    const fetchUserProfile = async () => {
      setIsLoading(true);
      const data = await getUserDetails(id);
      if(!data) notFound();
      setUserInfo(data);
      // console.log(data)
      setIsLoading(false);
    };
    fetchUserProfile();
  },[id]);



  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "famConnect");
    
    try {
      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      
      const imageUrl = cloudinaryData.secure_url;
      
      // Save the image URL to your backend
      const backendResponse = await fetch(`/api/profile/${id}/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
        }),
      });
      
      const backendData = await backendResponse.json();
      if (!backendResponse.ok) {
        throw new Error(backendData.message || "Failed to update user image in database");
      }
      
      // Update UI
      setProfileImage(imageUrl);
      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to update image");
    }
  };

  const handleSave = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    if (!userInfo) return;
  
    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username }),
      });
  
      if (!res.ok) {
        console.error('Failed to update user profile');
        return;
      }
      
      toast.success('Profile Updated');
      // Update the local state in UserContext
      setUsername(username); 
   
      const updatedUserData = await getUserDetails(id);
      if (updatedUserData) {
        setUserInfo(updatedUserData); 
        console.log('User data re-fetched:', updatedUserData);
      }
  
      console.log('User Profile Updated');
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  const handleChangePassword = async () => {

    const email = userEmail;
 
    if (!email) return;
  
    try {
      const response = await fetch('/api/forgot-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || 'Failed to request password reset');
      }
      toast.success('Password Reset Email Sent');
      
    } catch (error) {
      console.error('Password Reset Request Error:', error);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteAccount = async() => {
   
    //check user auth
    if(!session) return;
    setIsDeleting(true);
    try{
      const res = await fetch(`/api/profile/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!res.ok) {
        console.error('Failed to delete account');
        return;
      }
      toast.success('Account Deleted');
      // Then sign the user out
      await signOut({ redirect: false });
      router.push('/');  
    } catch (error) {
      setIsDeleting(false);
      closeDeleteModal();
      console.error('Delete Account Error:', error);
    }
    
  };

  const handleLeaveGroup = (group:any) => {
    // setGroups(groups.filter(g => g !== group));
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl dark:bg-gray-800 shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800  h-32 sm:h-48"></div>
          <div className="px-4 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="-mt-16 sm:-mt-24 mb-4 sm:mb-0">
                <div className="relative">
                  <Image 
                    src={profileImage || '/images/profile/default.jpg'} 
                    alt="Profile" 
                    width={128} 
                    height={128} 
                    className="rounded-full h-32 w-32 object-cover border-4 border-white dark:border-gray-800 shadow-lg" 
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition duration-200 shadow-md">
                    <input type="file" accept="image/*" className="hidden" onChange={(e)=>{handleImageChange(e)}} />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </label>
                </div>
              </div>
              <div className="text-center sm:text-left sm:ml-6 flex-1">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{username || ""}</h1>
              <p className="text-gray-600 dark:text-white">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition duration-200 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('groups')} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition duration-200 ${activeTab === 'groups' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Groups
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('security')} 
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition duration-200 ${activeTab === 'security' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Security
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 md:p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">Edit Profile</h2>
                  <form className="space-y-6" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Name</label>
                        <input
                          type="text"
                          value={username || ''} 
                          onChange={(e) => {
                            setUsername(e.target.value);
                            
                          }}
                          className="w-full p-3 border border-gray-800 rounded-lg bg-white text-black dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={userEmail || ''} 
                          readOnly 
                          className="w-full p-3 border border-gray-300 bg-gray-400 text-black dark:bg-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-not-allowed" 
                          placeholder="Enter your email"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          To change your email address, please contact support.
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Groups Tab */}
              {activeTab === 'groups' && (
                <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Joined Groups</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userInfo?.familyGroups?.map((group, index) => ( // Optional chaining
                    <div key={group.id} className="bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3"></div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-black dark:text-white">{group.name}</span>
                          <button
                            onClick={() => handleLeaveGroup(group)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Leave
                          </button>
                        </div>
                        {userInfo?.familyMembers.map((familyMember) => (
                          <div key={familyMember.family.id} className="mt-2 text-sm text-gray-400">
                            {familyMember.family._count.members} {familyMember.family._count.members === 1 ? 'member' : 'members'}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {userInfo?.familyGroups?.length === 0 && ( 
                    <div className="col-span-full text-center p-8">
                      <p className="text-gray-400">You haven&apos;t joined any groups yet.</p>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="dark:bg-gray-800 bg-white rounded-lg p-4 border border-gray-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium dark:text-white text-black">Password</h3>
                        <p className="text-sm text-gray-400 mt-1">Reset your account password</p>
                      </div>
                      <button 
                        onClick={handleChangePassword} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-sm"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                 
                  <div className="dark:bg-gray-800 bg-white rounded-lg p-4 border border-gray-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-red-400">Delete Account</h3>
                        <p className="text-sm text-gray-400 mt-1">Permanently delete your account and all data</p>
                      </div>
                      <button 
                        onClick={openDeleteModal} 
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <DeleteAccount
                      isOpen={showDeleteModal}
                      onClose={closeDeleteModal}
                      onConfirm={handleDeleteAccount}
                      isDeleting={isDeleting}
                    />
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

 
      
    </div>
  );
}
