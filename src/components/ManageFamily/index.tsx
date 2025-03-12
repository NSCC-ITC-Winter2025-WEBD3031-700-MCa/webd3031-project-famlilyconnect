'use client'

import { useState, useEffect } from 'react';
import JoinFamily from './JoinFamily';
import CreateFamily from './CreateFamily';
import InviteMember from './InviteMember';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


type Member = {
  role: 'admin' | 'viewer' | 'member';
  userId: string;
};

type Family = {
  id: string;
  name: string;
  members: Member[];
};

const ManageFamily = () => {
  const [activeTab, setActiveTab] = useState<'join' | 'create' | 'invite'>('join');
  const [families, setFamilies] = useState<Family[]>([]);
  const [creatorFamilyId, setCreatorFamilyId] = useState<string | null>(null);
  
  const router = useRouter();

  const { data: session } = useSession() as {
    data: { user: { id: string } } | null;

  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {

    try {
      const response = await fetch('/api/family');
      const data = await response.json();
      if (response.ok) {
        console.log('Families:', data);
        if (data.length > 0) {
          setCreatorFamilyId(data[0].id);
        }
        setFamilies(data);
      } else {
        console.error('Error fetching families:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFamilyClick = (familyId: string) => {
    router.push(`/family/${familyId}`);
  };

  const hasCreatedFamily = families.some(family =>
    family.members.some(member => member.userId === session?.user.id && member.role === 'admin')
  );
  

  const handleCreateFamily = (familyName: string) => {

    if (!session?.user?.id) {
      console.error('User is not logged in.');
      return;
    }

    const newFamily: Family = {
      id: `family${families.length + 1}`,
      name: familyName,
      members: [
        {
          role: 'admin',
          userId: session.user.id,
        },
      ],
    };
    setFamilies([...families, newFamily]);
    setActiveTab('invite');
  };

  const handleJoinFamily = (inviteCode: string) => {

    if (!session?.user?.id) {
      console.error('User is not logged in.');
      return;
    }

    const joinedFamily: Family = {
      id: `family${families.length + 1}`,
      name: 'Joined Family',
      members: [
        {
          role: 'viewer',
          userId: session.user.id,
        },
      ],
    };
    setFamilies([...families, joinedFamily]);
    alert(`Joined family with invite code: ${inviteCode}`);
  };

  const handleInviteMember = (email: string) => {
    alert(`Invited member: ${email}`);
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-2 rounded-lg shadow-lg mt-24 mb-20 max-w-4xl mx-auto">

      <div className="mb-6">
        <h3 className="text-lg font-semibold dark:text-white mb-4">Your Family Groups</h3>
        <div className="space-y-4">
        {families.map((family) => (
          <div
            key={family.id}
            className="p-6 bg-white dark:bg-dark-2 rounded-lg shadow-lg flex justify-between items-center transition-transform transform hover:scale-105"
          >
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500">
                {family.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Role: {family.members.some((member) => member.userId === session?.user.id)
                  ? family.members.find((member) => member.userId === session?.user.id)?.role
                  : 'Not a member'}
              </p>
            </div>

            <button
              onClick={() => handleFamilyClick(family.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
            >
              Enter
            </button>
          </div>
        ))}
      </div>

      </div>


      <div className="flex space-x-4 mb-6">

        <button
          onClick={() => setActiveTab('join')}
          className={`p-2 rounded-lg transition duration-300 ${activeTab === 'join' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-dark-1 dark:text-black hover:bg-gray-300 dark:hover:bg-dark-3 dark:hover:text-white'}`}
        >
          Join Family
        </button>


        <button
          onClick={() => setActiveTab('create')}
          disabled={hasCreatedFamily}
          className={`p-2 rounded-lg transition duration-300 ${activeTab === 'create' ? 'bg-blue-500 text-white' : `bg-gray-200 dark:bg-dark-1 dark:text-black ${hasCreatedFamily ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300 dark:hover:bg-dark-3 dark:hover:text-white'}`}`}
        >
          Create Family
        </button>


        <button
          onClick={() => setActiveTab('invite')}
          className={`p-2 rounded-lg transition duration-300 ${activeTab === 'invite' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-dark-1 dark:text-black hover:bg-gray-300 dark:hover:bg-dark-3 dark:hover:text-white'}`}
        >
          Invite Member
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'join' && <JoinFamily onJoinFamily={handleJoinFamily} />}
        {activeTab === 'create' && <CreateFamily onCreateFamily={handleCreateFamily} fetchFamilies={fetchFamilies} />}
        {activeTab === 'invite' && <InviteMember onInviteMember={handleInviteMember} creatorFamilyId={creatorFamilyId ?? ''} />}
      </div>
    </div>
  );
};

export default ManageFamily;
