"use client"; 

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { User, Calendar, MessageSquare, Image as ImageIcon } from "lucide-react";

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

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchFamily = async () => {
      setIsLoading(true);
      const data = await getFamilyDetails(id);
      if (!data) {
        notFound();
      }
      setFamily(data);
      setIsLoading(false);
    };
    fetchFamily();
  }, [id]);

  // Dummy data for demonstration
  const posts = [
    { id: "post1", content: "This is a post from Family A.", author: "Jane Doe", timestamp: "2 days ago" },
    { id: "post2", content: "Another post from Family A.", author: "John Smith", timestamp: "5 days ago" },
  ];

  const events = [
    { id: "event1", title: "Family Trip", date: "2023-10-15", location: "Beach Resort", attendees: 6 },
    { id: "event2", title: "Birthday Party", date: "2023-11-01", location: "Home", attendees: 12 },
  ];

  const photos = [
    {
      id: "photo1",
      url: "/images/family/family-create.jpg",
      description: "Family photo 1",
      takenBy: "Mom",
      takenOn: "July 2023"
    },
    {
      id: "photo2",
      url: "/images/family/family-create.jpg",
      description: "Family photo 2",
      takenBy: "Dad", 
      takenOn: "August 2023"
    },
    {
      id: "photo3",
      url: "/images/family/family-create.jpg",
      description: "Family vacation",
      takenBy: "Uncle Bob",
      takenOn: "September 2023"
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading family details...</p>
        </div>
      </div>
    );
  }

  const TabButton = ({ tab, icon, label }: { tab: "members" | "posts" | "events" | "photos", icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 rounded-lg px-4 py-3 text-left transition-all duration-300 ${
        activeTab === tab
          ? "bg-blue-500 text-white shadow-md"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Header with family name and image */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{family.name}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <nav className="p-2">
                <div className="flex flex-col gap-2">
                  <TabButton 
                    tab="members" 
                    icon={<User size={18} className={activeTab === "members" ? "text-white" : "text-blue-500"} />} 
                    label="Members" 
                  />
                  <TabButton 
                    tab="posts" 
                    icon={<MessageSquare size={18} className={activeTab === "posts" ? "text-white" : "text-blue-500"} />} 
                    label="Posts" 
                  />
                  <TabButton 
                    tab="events" 
                    icon={<Calendar size={18} className={activeTab === "events" ? "text-white" : "text-blue-500"} />} 
                    label="Events" 
                  />
                  <TabButton 
                    tab="photos" 
                    icon={<ImageIcon size={18} className={activeTab === "photos" ? "text-white" : "text-blue-500"} />} 
                    label="Photos" 
                  />
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              {/* Members Tab */}
              {activeTab === "members" && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Family Members</h2>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      Add Member
                    </button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {family.members && family.members.length > 0 ? (
                      family.members.map((member: { id: string; userId: string; role: string; user: { name: string | null; email: string } }) => (
                        <div
                          key={member.id}
                          className="flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-md transition-shadow duration-300"
                        >
                          <div className="bg-blue-100 dark:bg-blue-900 h-12 w-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">
                              {(member.user?.name || member.user?.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white">
                              {member.user?.name || member.user?.email || 'Unknown Member'}
                            </h3>
                            <div className="mt-1 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">No members found. Add family members to get started!</p>
                    )}
                  </div>
                </section>
              )}

              {/* Posts Tab */}
              {activeTab === "posts" && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Family Posts</h2>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      New Post
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-lg bg-gray-50 dark:bg-gray-700 p-5 border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex items-center mb-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                            <span className="text-blue-700 dark:text-blue-300 font-bold text-sm">
                              {post.author.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{post.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                        <div className="flex gap-4 mt-4">
                          <button className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 hover:text-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905V19c0 .47-.305.85-.68.98l-1.7.59A1.5 1.5 0 017 19V4.5"></path>
                            </svg>
                            Like
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 hover:text-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                            </svg>
                            Comment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Family Events</h2>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      Add Event
                    </button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg bg-white dark:bg-gray-700 p-5 shadow-md border border-gray-100 dark:border-gray-600 hover:shadow-lg transition-shadow"
                      >
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mb-3">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                          </svg>
                          {event.attendees} attendees
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 flex justify-end">
                          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Photos Tab */}
              {activeTab === "photos" && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Family Photos</h2>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                      Upload Photos
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="rounded-xl overflow-hidden bg-white dark:bg-gray-700 shadow-md group hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={photo.url}
                            alt={photo.description}
                            width={400}
                            height={400}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <p className="font-medium text-gray-800 dark:text-white">{photo.description}</p>
                          <div className="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>By {photo.takenBy}</span>
                            <span>{photo.takenOn}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetail;