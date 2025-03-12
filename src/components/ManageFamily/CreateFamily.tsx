'use client'

import { useState } from 'react';

interface CreateFamilyProps {
  fetchFamilies: () => void;
  onCreateFamily: (inviteCode: string) => void;
}



const CreateFamily = ({ fetchFamilies,onCreateFamily }: CreateFamilyProps) => {
  const [familyName, setFamilyName] = useState('');

  const handleCreateFamily = async () => {
    const response = await fetch('/api/family', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: familyName,
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      setFamilyName('');
      onCreateFamily(data.inviteCode);
      fetchFamilies();
      console.log('Family created:', data);
    } else {
      const error = await response.json();
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold dark:text-white mb-4">Create a Family</h3>
      <input
        type="text"
        placeholder="Enter Family Name"
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
        className="w-full p-2 border rounded-lg dark:bg-dark-1 dark:text-white"
      />
      <button
        onClick={handleCreateFamily}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition duration-300"
      >
        Create Family
      </button>
    </div>
  );
};

export default CreateFamily;