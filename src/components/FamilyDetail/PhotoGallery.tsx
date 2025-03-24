'use client'

import { Image as ImageIcon, Plus, Upload, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type Photo = {
  id: string;
  url: string;
  createdAt: Date;
  uploader: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
  };
};

type FamilyMember = {
  id: string;
  userId: string;
  role: string;
  user: {
    name: string | null;
    email: string | null;
  };
};

const PhotoGallery = ({ 
  photos, 
  familyId, 
  fetchFamily
}: { 
  photos: Photo[]; 
  familyId: string;
  fetchFamily: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [enlargedPhoto, setEnlargedPhoto] = useState<Photo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pagination settings
  const photosPerPage = 9;
  const totalPages = Math.ceil(photos.length / photosPerPage);

  // Get paginated photos
  const paginatedPhotos = photos.slice(
    (currentPage - 1) * photosPerPage, 
    currentPage * photosPerPage
  );

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "famConnect");

    setIsUploading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        await savePhotoToDatabase(data.secure_url, data.public_id);
      }
      toast.success("Photo uploaded successfully");

    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const savePhotoToDatabase = async (photoUrl: string, publicId: string) => {
    try {
      const requestBody = {
        url: photoUrl,
        publicId: publicId,
        uoloadAt: new Date(),
      };

      const response = await fetch(`/api/family/${familyId}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to save photo to database");

      fetchFamily();
      // Reset to first page after uploading
      setCurrentPage(1);

    } catch (error) {
      console.error("Error saving photo to database:", error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/family/${familyId}/image/${photoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete photo");

      toast.success("Photo deleted successfully");
      fetchFamily();
      // Adjust pagination if needed
      if (paginatedPhotos.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <section>
      {/* Enlarged Photo Modal */}
      {enlargedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setEnlargedPhoto(null)}
        >
          <div className="relative max-w-[90%] max-h-[90%]">
            <button 
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-[-40px] right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <Image
              src={enlargedPhoto.url}
              alt="Enlarged family photo"
              width={1000}
              height={1000}
              className="max-w-full max-h-full object-contain"
            />
            <div className="mt-2 text-center text-white">
              <p>Uploaded by {enlargedPhoto.uploader?.name || enlargedPhoto.uploader?.email || 'Unknown'}</p>
              <p>{formatDate(enlargedPhoto.createdAt)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Family Photos</h2>
        <button 
          onClick={handleUploadClick}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
        >
          {isUploading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>Upload Photos</span>
            </>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpdate}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {photos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {paginatedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-xl overflow-hidden bg-white dark:bg-gray-700 shadow-md group hover:shadow-lg transition-shadow duration-300 relative"
              >
                <div 
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => setEnlargedPhoto(photo)}
                >
                  <Image
                    src={photo.url}
                    alt={`Family photo uploaded by ${photo.uploader?.name || 'a family member'}`}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>By {photo.uploader?.name || photo.uploader?.email || 'Unknown'}</span>
                    <span>{formatDate(photo.createdAt)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="absolute top-2 right-2 bg-red-500/80 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-600 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          <div className="bg-gray-100 dark:bg-gray-600 p-4 rounded-full mb-4">
            <ImageIcon size={24} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No photos yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mt-2">
            Upload your first family photo to start sharing memories with your loved ones.
          </p>
          <button
            onClick={handleUploadClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Photo</span>
          </button>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;