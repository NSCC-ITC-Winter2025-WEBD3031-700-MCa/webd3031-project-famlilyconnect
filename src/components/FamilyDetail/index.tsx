"use client"; 

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";

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

const FamilyDeatil = () => {
  const [activeTab, setActiveTab] = useState<
    "members" | "posts" | "events" | "photos"
  >("members");
  const [family, setFamily] = useState<any>(null);

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchFamily = async () => {
      const data = await getFamilyDetails(id);
      if (!data) {
        notFound();
      }
      setFamily(data);
    };
    fetchFamily();
  }, [id]);

  if (!family) {
    return <div>Loading...</div>;
  }

  const posts = [
    { id: "post1", content: "This is a post from Family A." },
    { id: "post2", content: "Another post from Family A." },
  ];

  const events = [
    { id: "event1", title: "Family Trip", date: "2023-10-15" },
    { id: "event2", title: "Birthday Party", date: "2023-11-01" },
  ];

  const photos = [
    {
      id: "photo1",
      url: "https://via.placeholder.com/150",
      description: "Family photo 1",
    },
    {
      id: "photo2",
      url: "https://via.placeholder.com/150",
      description: "Family photo 2",
    },
  ];

  return (
    <div className="dark:bg-dark-1 mt-24 flex min-h-screen flex-col bg-gray-100 md:flex-row">
      <aside className="mb-6 w-full bg-white p-6 shadow-lg dark:bg-dark-2 md:mb-0 md:w-64">
        <h1 className="mb-6 text-2xl font-semibold dark:text-white">
          {family.name}
        </h1>
        <nav>
          <ul className="flex flex-wrap justify-center gap-4 md:flex-col ">
            <li>
              <button
                onClick={() => setActiveTab("members")}
                className={`w-full rounded-lg p-2 text-left transition duration-300 ${
                  activeTab === "members"
                    ? "bg-blue-500 text-white"
                    : "dark:bg-dark-1 bg-gray-200 hover:bg-gray-300 dark:hover:bg-dark-3"
                }`}
              >
                Members
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("posts")}
                className={`w-full rounded-lg p-2 text-left transition duration-300 ${
                  activeTab === "posts"
                    ? "bg-blue-500 text-white"
                    : "dark:bg-dark-1 bg-gray-200 hover:bg-gray-300 dark:hover:bg-dark-3"
                }`}
              >
                Posts
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("events")}
                className={`w-full rounded-lg p-2 text-left transition duration-300 ${
                  activeTab === "events"
                    ? "bg-blue-500 text-white"
                    : "dark:bg-dark-1 bg-gray-200 hover:bg-gray-300 dark:hover:bg-dark-3"
                }`}
              >
                Events
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("photos")}
                className={`w-full rounded-lg p-2 text-left transition duration-300 ${
                  activeTab === "photos"
                    ? "bg-blue-500 text-white"
                    : "dark:bg-dark-1 bg-gray-200 hover:bg-gray-300 dark:hover:bg-dark-3"
                }`}
              >
                Photos
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === "members" && (
        <section>
        <h2 className="mb-6 text-xl font-semibold dark:text-white">Members</h2>
        <div className="space-y-6">
          {family.members && family.members.length > 0 ? (
            family.members.map((member: { id: string; userId: string; role: string; user: { name: string | null; email: string } }) => {
              
  
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-dark-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div>
                    <p className="text-md font-semibold dark:text-white">
                      Name: {member.user?.name || member.user?.email || 'Unknown Member'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Role: {member.role}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No members found.</p>
          )}
        </div>
      </section>
       
       
        )}

        {activeTab === "posts" && (
          <section>
            <h2 className="mb-4 text-xl font-semibold dark:text-white">
              Posts
            </h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg bg-white p-4 shadow dark:bg-dark-2"
                >
                  <p className="text-md dark:text-white">{post.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "events" && (
          <section>
            <h2 className="mb-4 text-xl font-semibold dark:text-white">
              Events
            </h2>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg bg-white p-4 shadow dark:bg-dark-2"
                >
                  <h3 className="text-lg font-semibold dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "photos" && (
          <section>
            <h2 className="mb-4 text-xl font-semibold dark:text-white">
              Photos
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-lg bg-white p-4 shadow dark:bg-dark-2"
                >
                  <Image
                    src={photo.url}
                    alt={photo.description}
                    width={300}
                    height={300}
                    className="h-auto w-full rounded-lg"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {photo.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default FamilyDeatil;
