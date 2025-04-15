"use client";
import { useUserContext } from "@/context/UserContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
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
  subscription: {
    id: string;
    status: string;
    stripeSubscriptionId: string;
    priceId: string;
    startDate: Date;
    endDate: Date | null;
  };
};

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const { username, userEmail, setUsername, profileImage, setProfileImage } =
    useUserContext();
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const userSubscription = userInfo?.subscription;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [groupToLeave, setGroupToLeave] = useState<string | null>();

  useEffect(() => {
    if (!id) return;
    if (!session) {
      router.push('/');
    }
    const fetchUserProfile = async () => {
      setIsLoading(true);
      const data = await getUserDetails(id);
      if (!data) notFound();
      setUserInfo(data);
      console.log(data);
      setIsLoading(false);
    };
    fetchUserProfile();
  }, [id]);

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
        },
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
        throw new Error(
          backendData.message || "Failed to update user image in database",
        );
      }

      // Update UI
      setProfileImage(imageUrl);
      toast.success("Image updated successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to update image");
    }
  };

  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!userInfo) return;

    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username }),
      });

      if (!res.ok) {
        console.error("Failed to update user profile");
        return;
      }

      toast.success("Profile Updated");
      // Update the local state in UserContext
      setUsername(username);

      const updatedUserData = await getUserDetails(id);
      if (updatedUserData) {
        setUserInfo(updatedUserData);
        console.log("User data re-fetched:", updatedUserData);
      }

      console.log("User Profile Updated");
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  const handleChangePassword = async () => {
    const email = userEmail;

    if (!email) return;

    try {
      const response = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Failed to request password reset");
      }
      toast.success("Password Reset Email Sent");
    } catch (error) {
      console.error("Password Reset Request Error:", error);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteAccount = async () => {
    //check user auth
    if (!session) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/profile/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!res.ok) {
        console.error("Failed to delete account");
        return;
      }
      toast.success("Account Deleted");
      // Then sign the user out
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      setIsDeleting(false);
      closeDeleteModal();
      console.error("Delete Account Error:", error);
    }
  };

  const confirmLeaveGroup = async () => {
    if (!groupToLeave || isProcessing) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/family/${groupToLeave}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to leave group");
      }

      setUserInfo((prevUserInfo) => {
        if (!prevUserInfo) return null;
        return {
          ...prevUserInfo,
          familyGroups: prevUserInfo.familyGroups.filter(
            (g) => g.id !== groupToLeave,
          ),
          familyMembers: prevUserInfo.familyMembers.filter(
            (fm) => fm.family.id !== groupToLeave,
          ),
        };
      });
      setShowConfirmModal(false);
      toast.success(`Successfully left group`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to leave group";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLeaveGroup = async (groupId: any) => {
    if (isProcessing) return;
    setGroupToLeave(groupId);
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-700 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Profile Header Card */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700  dark:to-indigo-800 sm:h-48"></div>
          <div className="relative px-4 pb-8 sm:px-8">
            <div className="flex flex-col items-center sm:flex-row">
              <div className="-mt-16 mb-4 sm:-mt-24 sm:mb-0">
                <div className="relative">
                  <Image
                    src={profileImage || "/images/profile/default.jpg"}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
                  />
                  <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-blue-500 p-2 text-white shadow-md transition duration-200 hover:bg-blue-600">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleImageChange(e);
                      }}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </label>
                </div>
              </div>
              <div className="flex-1 text-center sm:ml-6 sm:text-left">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {username || ""}
                </h1>
                <p className="text-gray-600 dark:text-white">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Left Sidebar - Navigation */}
          <div className="w-full flex-shrink-0 md:w-64">
            <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition duration-200 ${activeTab === "profile" ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("groups")}
                      className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition duration-200 ${activeTab === "groups" ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Groups
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition duration-200 ${activeTab === "security" ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Security
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("subscription")}
                      className={`flex w-full items-center rounded-lg px-4 py-3 text-left transition duration-200 ${
                        activeTab === "subscription" ? "bg-blue-50 font-medium text-blue-600" : "text-gray-700 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-3 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3C5.58 3 2 6.58 2 10s3.58 7 8 7 8-3.58 8-7-3.58-7-8-7zm0 12c-2.47 0-4.5-1.69-5.25-4h10.5c-.75 2.31-2.78 4-5.25 4zM10 5c2.76 0 5 2.24 5 5h-10c0-2.76 2.24-5 5-5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Subscription
                    </button>
                  </li>

                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="overflow-hidden rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 md:p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
                    Edit Profile
                  </h2>
                  <form className="space-y-6" onSubmit={handleSave}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white">
                          Name
                        </label>
                        <input
                          type="text"
                          value={username || ""}
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                          className="w-full rounded-lg border border-gray-800 bg-white p-3 text-black transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userEmail || ""}
                          readOnly
                          className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-400 p-3 text-black transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                          placeholder="Enter your email"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          To change your email address, please contact support.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition duration-200 hover:bg-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Groups Tab */}
              {activeTab === "groups" && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                    Joined Groups
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {userInfo?.familyGroups?.map((group, index) => (
                      <div
                        key={group.id}
                        className="overflow-hidden rounded-lg border border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-gray-800"
                      >
                        <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-black dark:text-white">
                              {group.name}
                            </span>
                            <button
                              onClick={() => handleLeaveGroup(group.id)}
                              className="flex items-center text-sm text-red-400 transition-colors duration-200 hover:text-red-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1 h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Leave
                            </button>
                          </div>
                          {(() => {
                            const familyMember = userInfo?.familyMembers.find(
                              (fm) => fm.family.id === group.id,
                            );
                            const memberCount =
                              familyMember?.family._count.members || 0;
                            return (
                              <div className="mt-2 text-sm text-gray-400">
                                {memberCount}{" "}
                                {memberCount === 1 ? "member" : "members"}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}

                    {userInfo?.familyGroups?.length === 0 && (
                      <div className="col-span-full p-8 text-center">
                        <p className="text-gray-400">
                          You haven&apos;t joined any groups yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                  <div className="relative max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                    <div className="mb-5 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-red-500 dark:text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Leave the family group
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Are you sure you want to leave from this family group?
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        This action cannot be undone.
                      </p>
                    </div>
                    <div className="mt-5 flex justify-center gap-3">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        disabled={isProcessing}
                        className="min-w-24 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmLeaveGroup}
                        disabled={isProcessing}
                        className="min-w-24 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800"
                      >
                        {isProcessing ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="h-4 w-4 animate-spin text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        ) : (
                          "Leave"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                    Security Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-black dark:text-white">
                            Password
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            Reset your account password
                          </p>
                        </div>
                        <button
                          onClick={handleChangePassword}
                          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition duration-200 hover:bg-blue-700"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-red-400">
                            Delete Account
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <button
                          onClick={openDeleteModal}
                          className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white shadow-sm transition duration-200 hover:bg-red-600"
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

              {/* Subscription Tab */}
                {activeTab === "subscription" && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
                      Subscription Details
                    </h2>
                    <div className="space-y-6">
                      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-black dark:text-white">
                              Status
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                              {userInfo?.subscription ? userInfo.subscription.status : "No active subscription"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-black dark:text-white">
                              Plan
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                              {userInfo?.subscription ? userInfo.subscription.priceId : 0} Per Month
                            </p>
                          </div>
                        </div>
                      </div> */}

                      {/* Price Display */}
                      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800 mt-4">
                        <h3 className="text-lg font-medium text-black dark:text-white">Price</h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {userSubscription
                            ? `$ ${(userSubscription.priceId === "price_1R4QGtD7DIzyfrQEGOQY8lEk" ? 5 : 5).toFixed(2)} / month` 
                            : "No Active Plan"}
                        </p>
                      </div>

                      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-black dark:text-white">
                              Start Date
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                              {userInfo?.subscription
                                ? new Date(userInfo.subscription.startDate).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-black dark:text-white">
                              End Date
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                              {userInfo?.subscription?.endDate
                                ? new Date(userInfo.subscription.endDate).toLocaleDateString()
                                : "Ongoing"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method (Last 4 digits) */}
                      <div className="rounded-lg border border-gray-300 bg-white p-4 dark:bg-gray-800">
                        <h3 className="text-lg font-medium text-black dark:text-white">Payment Method</h3>
                        <p className="mt-1 text-sm text-gray-400">{userInfo?.subscription ? `**** **** **** ${userInfo.subscription.stripeSubscriptionId.slice(-4)}` : "N/A"}</p>
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
