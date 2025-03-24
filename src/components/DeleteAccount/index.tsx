"use client"
import { useState } from 'react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteAccount = ({ isOpen, onClose, onConfirm, isDeleting }: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="dark:bg-gray-800 bg-white p-6 rounded-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 dark:text-white text-black">Delete Account</h2>
      
      <p className="mb-4 dark:text-gray-300 text-gray-700">
        Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.
      </p>
      
      <div className="mt-4 mb-4">
        <label className="block mb-2 dark:text-gray-300 text-gray-700">
          Please type &quot;DELETE&quot; to confirm:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="border border-gray-600 dark:bg-gray-700 dark:text-white bg-gray-100 text-grey-800 p-2 w-full rounded"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-600 rounded dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          disabled={isDeleting}
        >
          Cancel
        </button>
        
        <button
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          disabled={isDeleting || confirmText !== "DELETE"}
        >
          {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
        </button>
      </div>
    </div>
  </div>
  );
};

export default DeleteAccount;