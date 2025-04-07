"use client";

import { Photo as PrismaPhoto } from "@prisma/client";
import { canCreateContent, canEditContent, canDeleteContent } from "@/utils/roles";
import {
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  Newspaper,
  User
} from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Event from "../Event";
import CreateEventForm from "../Event/CreateEventForm";
import Post from "../Post";
import CreatePost from "../Post/CreatePost";
import PhotoGallery from "./PhotoGallery";
import FamilyMember from "../FamilyMember";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Photo extends PrismaPhoto {
  uploader: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
  };
}



const getFamilyDetails = async (id: string) => {
  try {
    const res = await fetch(`/api/family/${id}`);
    return {
      status: res.status,
      data: await res.json().catch(() => null)
    };
  } catch (error) {
    console.error("Failed to fetch family details:", error);
    return null;
  }
};

const FamilyDetail = () => {
  const [activeTab, setActiveTab] = useState<
    "members" | "posts" | "events" | "photos"
  >("members");
  const [family, setFamily] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();


  const currentUserRole = family?.members?.find(
    (member: any) => member.userId === session?.user?.id
  )?.role || "viewer";

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchFamily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFamily = async () => {
    const result = await getFamilyDetails(id);
    if (!result) {
      setIsLoading(false);
      return notFound();
    }
    const { status, data } = result;
    
    if (status === 403) {
      toast.error("You're no longer a member");
      router.push('/family');
      return;
    }
  
    setFamily(data);
    setEvents(data.events);
    setPosts(data.posts);

    const allPhotos = data.photos.map((photo: any) => ({
      ...photo,
      createdAt: new Date(photo.createdAt),
      uploader: {
        id: photo.uploaderId,
        name: photo.uploader?.name || null,
        email: photo.uploader?.email || null,
        createdAt: new Date(photo.uploader?.createdAt || photo.createdAt),
      },
    }));

    setPhotos(allPhotos);

    setIsLoading(false);
  };

  const handleCreateEvent = () => {
    setIsCreateEventModalOpen((prev) => !prev);
  };

  const handleCreatePost = () => {
    setIsCreatePostModalOpen((prev) => !prev);
  };
  const handleMemberRemoved = (memberId: string) => {
    setFamily((prev: { members: any[]; }) => prev ? {
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    } : null);
  };

  // Handler for when a role is changed
  const handleRoleChanged = (memberId: string, newRole: "admin" | "editor" | "viewer") => {
    setFamily((prev: { members: any[]; }) => prev ? {
      ...prev,
      members: prev.members.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      )
    } : null);
  };

  const TabButton = ({
    tab,
    icon,
    label,
  }: {
    tab: "members" | "posts" | "events" | "photos";
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-left transition-all duration-300 ${
        activeTab === tab
          ? "bg-blue-500 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!family) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 dark:bg-gray-900">
      {/* Header with family name and image */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {family.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full flex-shrink-0 md:w-64">
            <div className="sticky top-24 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800">
              <nav className="p-2">
                <div className="flex flex-col gap-2">
                  <TabButton
                    tab="members"
                    icon={
                      <User
                        size={18}
                        className={
                          activeTab === "members"
                            ? "text-white"
                            : "text-blue-500"
                        }
                      />
                    }
                    label="Members"
                  />
                  <TabButton
                    tab="posts"
                    icon={
                      <MessageSquare
                        size={18}
                        className={
                          activeTab === "posts" ? "text-white" : "text-blue-500"
                        }
                      />
                    }
                    label="Posts"
                  />
                  <TabButton
                    tab="events"
                    icon={
                      <Calendar
                        size={18}
                        className={
                          activeTab === "events"
                            ? "text-white"
                            : "text-blue-500"
                        }
                      />
                    }
                    label="Events"
                  />
                  <TabButton
                    tab="photos"
                    icon={
                      <ImageIcon
                        size={18}
                        className={
                          activeTab === "photos"
                            ? "text-white"
                            : "text-blue-500"
                        }
                      />
                    }
                    label="Photos"
                  />
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
              {/* Members Tab */}
              {activeTab === "members" && family && session?.user && (
            <FamilyMember
              members={family.members}
              currentUserId={session.user.id}
              familyId={family.id}
              onMemberRemoved={handleMemberRemoved}
              onRoleChanged={handleRoleChanged}
            />
          )}

              {/* Posts Tab */}
              {activeTab === "posts" && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Family Posts
                    </h2>
                  {canCreateContent(currentUserRole) &&(
                    <button
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                      onClick={() => handleCreatePost()}
                    >
                      {isCreatePostModalOpen ? "Close" : "Create Post"}
                    </button>
                  )}
                  </div>

                  {isCreatePostModalOpen && (
                    <CreatePost
                      familyId={id}
                      fetchFamily={fetchFamily}
                      setIsCreatePostModalOpen={setIsCreatePostModalOpen}
                    />
                  )}

                  {!isCreatePostModalOpen &&
                    (posts.length > 0 ? (
                      <Post
                        posts={posts}
                        familyId={id}
                        setPosts={setPosts}
                        currentUserRole={currentUserRole}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-16 transition-all duration-300 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 hover:dark:border-gray-600">
                        <div className="mb-5 rounded-full bg-gray-100 p-5 shadow-inner dark:bg-gray-700">
                          <Newspaper
                            size={28}
                            className="text-gray-400 dark:text-gray-300"
                          />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                          No post created yet
                        </h3>
                        <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
                          Create your first post to start organizing gatherings
                          with friends and family.
                        </p>
                      </div>
                    ))}
                </section>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Family Events
                    </h2>
                  {canCreateContent(currentUserRole) &&(
                    <button
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                      onClick={() => handleCreateEvent()}
                    >
                      {isCreateEventModalOpen ? "Close" : "Create Event"}
                    </button>
                  )}
                  </div>

                  {isCreateEventModalOpen && (
                    <CreateEventForm
                      familyId={id}
                      familyMembers={[]}
                      fetchFamily={fetchFamily}
                      setIsCreateEventModalOpen={setIsCreateEventModalOpen}
                    />
                  )}

                  {!isCreateEventModalOpen &&
                    (events.length > 0 ? (
                      <Event
                        events={events}
                        familyId={id}
                        fetchFamily={fetchFamily}
                        currentUserRole={currentUserRole}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-16 transition-all duration-300 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 hover:dark:border-gray-600">
                        <div className="mb-5 rounded-full bg-gray-100 p-5 shadow-inner dark:bg-gray-700">
                          <Calendar
                            size={28}
                            className="text-gray-400 dark:text-gray-300"
                          />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                          No events created yet
                        </h3>
                        <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
                          Create your first event to start organizing gatherings
                          with friends and family.
                        </p>
                      </div>
                    ))}
                </section>
              )}

              {/* Photos Tab */}

              {activeTab === "photos" && (
                <PhotoGallery
                  key={family.id}
                  photos={photos}
                  familyId={family.id}
                  fetchFamily={fetchFamily}
                  currentUserRole={currentUserRole}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetail;
