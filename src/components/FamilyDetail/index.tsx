"use client";

import { Photo as PrismaPhoto } from "@prisma/client";
import { Calendar, Image as ImageIcon, MessageSquare, Newspaper, Plus, User } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PhotoGallery from "./PhotoGallery";
import CreateEventForm from "../Event/CreateEventForm";
import Event from "../Event";
import Post from "../Post";
import CreatePost from "../Post/CreatePost";

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
    if (!res.ok) return null;
    return await res.json();
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

  const params = useParams();
  const id = params.id as string;

  
  useEffect(() => {
   
    fetchFamily();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFamily = async () => {
    
    const data = await getFamilyDetails(id);
    if (!data) {
      setIsLoading(false);
      notFound(); 
    }
    
    setFamily(data);
    setEvents(data.events);
    setPosts(data.posts)

    console.log(data);
   
  
    const allPhotos = data.photos.map((photo: any) => ({
      ...photo,
      createdAt: new Date(photo.createdAt),
      uploader: {
        id: photo.uploaderId,
        name: photo.uploader?.name || null,  
        email: photo.uploader?.email || null, 
        createdAt: new Date(photo.uploader?.createdAt || photo.createdAt),
      }
    }));

    setPhotos(allPhotos)

    setIsLoading(false);
  };

  const handleCreateEvent = () => {
    setIsCreateEventModalOpen((prev) => !prev);
  };

  const handleCreatePost = () => {
    setIsCreatePostModalOpen((prev) => !prev);  
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
              {activeTab === "members" && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Family Members
                    </h2>
                    <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
                      Add Member
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {family.members && family.members.length > 0 ? (
                      family.members.map(
                        (member: {
                          id: string;
                          userId: string;
                          role: string;
                          user: { name: string | null; email: string };
                        }) => (
                          <div
                            key={member.id}
                            className="flex items-start rounded-lg border border-gray-100 bg-gray-50 p-4 transition-shadow duration-300 hover:shadow-md dark:border-gray-600 dark:bg-gray-700"
                          >
                            <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                {(
                                  member.user?.name ||
                                  member.user?.email ||
                                  "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800 dark:text-white">
                                {member.user?.name ||
                                  member.user?.email ||
                                  "Unknown Member"}
                              </h3>
                              <div className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {member.role}
                              </div>
                            </div>
                          </div>
                        ),
                      )
                    ) : (
                      <p className="col-span-2 py-8 text-center text-gray-500 dark:text-gray-400">
                        No members found. Add family members to get started!
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Posts Tab */}
              {activeTab === "posts" && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Family Posts
                    </h2>
                    <button 
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                      onClick={() => handleCreatePost()}
                    >
                      {isCreatePostModalOpen ? "Close" : "Create Post"}
                    </button>
                  </div>

                  {isCreatePostModalOpen && (
                    <CreatePost familyId={id} fetchFamily = {fetchFamily} setIsCreatePostModalOpen={setIsCreatePostModalOpen} />
                  )}

                  {/* <div className="space-y-6">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-lg border border-gray-100 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-700"
                      >
                        <div className="mb-3 flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                              {post.author.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {post.author}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {post.timestamp}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {post.content}
                        </p>
                        <div className="mt-4 flex gap-4">
                          <button className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905V19c0 .47-.305.85-.68.98l-1.7.59A1.5 1.5 0 017 19V4.5"
                              ></path>
                            </svg>
                            Like
                          </button>
                          <button className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-blue-500 dark:text-gray-400">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              ></path>
                            </svg>
                            Comment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div> */}
                   {!isCreatePostModalOpen && (
                    posts.length > 0 ? (
                      <Post posts={posts} familyId={id} fetchFamily = {fetchFamily} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-gray-300 hover:dark:border-gray-600">
                        <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-full mb-5 shadow-inner">
                        <Newspaper  size={28} className="text-gray-400 dark:text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                          No post created yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                          Create your first post to start organizing gatherings with friends and family.
                        </p>
                      </div>
                    )
                  )}
                  
               
                </section>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <section>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Family Events
                    </h2>
                    <button
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                      onClick={() => handleCreateEvent()}
                    >
                      {isCreateEventModalOpen ? "Close" : "Create Event"}
                    </button>
                  </div>

                  {isCreateEventModalOpen && (
                    <CreateEventForm familyId={id} familyMembers={[]} fetchFamily = {fetchFamily} setIsCreateEventModalOpen={setIsCreateEventModalOpen} />
                  )}

                  {!isCreateEventModalOpen && (
                    events.length > 0 ? (
                      <Event events={events} familyId={id} fetchFamily = {fetchFamily} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50/50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-gray-300 hover:dark:border-gray-600">
                        <div className="bg-gray-100 dark:bg-gray-700 p-5 rounded-full mb-5 shadow-inner">
                        <Calendar size={28} className="text-gray-400 dark:text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                          No events created yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                          Create your first event to start organizing gatherings with friends and family.
                        </p>
                      </div>
                    )
                  )}
                </section>
              )}

              {/* Photos Tab */}
              
              {activeTab === "photos" && (
                <PhotoGallery 
                  key={family.id}
                  photos={photos}
                  familyId={family.id}
                  fetchFamily = {fetchFamily}
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
