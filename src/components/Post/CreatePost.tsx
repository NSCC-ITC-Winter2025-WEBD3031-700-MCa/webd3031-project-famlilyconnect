import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/UserContext';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface CreatePostProps {
  setIsCreatePostModalOpen: (isOpen: boolean) => void;
  familyId: string;
  fetchFamily: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ setIsCreatePostModalOpen, familyId, fetchFamily }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { profileImage } = useUserContext();

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsUploading(true);

    try {
  
      const response = await fetch(`/api/family/${familyId}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      setContent('');
      fetchFamily();
      setIsCreatePostModalOpen(false);
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <Image 
              src={profileImage || '/images/profile/default.jpg'} 
              alt="Profile" 
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="What's happening?"
                className="w-full min-h-[40px] text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent outline-none resize-none text-base"
                rows={isExpanded ? 3 : 1}
              />

            </div>
          </div>

          {(isExpanded) && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {isExpanded && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        if (!content) {
                          setIsCreatePostModalOpen(false);
                        }
                      }}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={(!content.trim()) || isUploading}
                    className="px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePost;