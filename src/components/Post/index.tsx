"use client";

import toast from "react-hot-toast";
import { canCreateContent, canEditContent, canDeleteContent, Role } from "@/utils/roles";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

interface PostListProps {
  posts: Post[];
  familyId: string;
  currentUserRole: Role;
  setPosts: (posts: Post[]) => void; 
}

export default function Post({ posts, familyId,
  setPosts , currentUserRole}: PostListProps) {


  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/family/${familyId}/post/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      const result = await response.json();
      toast.success("successfully delete the post");
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        
        
        return (
          <div
            key={post.id}
            className="relative rounded-lg border border-gray-100 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-700"
          >
            {canDeleteContent(currentUserRole)&& (
              <button
              onClick={() => handleDelete(post.id)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              aria-label="Delete post"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            )}
              
          

            <div className="mb-3 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {post.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">
                  {post.author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
          </div>
        );
      })}
    </div>
  );
}