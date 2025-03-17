'use client'

import { useState, useEffect } from 'react';
import JoinFamily from './JoinFamily';
import CreateFamily from './CreateFamily';
import InviteMember from './InviteMember';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserPlus, UserCheck, Home, Plus, ArrowRight } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const router = useRouter();

  const { data: session } = useSession() as {
    data: { user: { id: string } } | null;
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilyClick = (familyId: string) => {
    router.push(`/family/${familyId}`);
  };

  const hasCreatedFamily = families.some(family =>
    family.members.some(member => member.userId === session?.user?.id && member.role === 'admin')
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Admin</span>;
      case 'member':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Member</span>;
      case 'viewer':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Viewer</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{role}</span>;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-24 mb-20 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Family Dashboard</h2>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Family Groups</h3>
          <button 
            onClick={() => setActiveTab('create')}
            disabled={hasCreatedFamily}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition duration-200 ${
              hasCreatedFamily 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            <Plus size={16} />
            New Family
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : families.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {families.map((family) => {
              const userRole = family.members.find((member) => member.userId === session?.user?.id)?.role;
              return (
                <div
                  key={family.id}
                  className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-100 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {family.name}
                    </h4>
                    {userRole && getRoleBadge(userRole)}
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                    {family.members.length} {family.members.length === 1 ? 'member' : 'members'}
                  </p>
                  
                  <button
                    onClick={() => handleFamilyClick(family.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  >
                    <Home size={16} />
                    Enter Family
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-lg text-center">
            <p className="text-blue-800 dark:text-blue-200 mb-3">You haven&apos;t joined any families yet.</p>
            <p className="text-sm text-blue-600 dark:text-blue-300">Create a new family or join an existing one using the options below.</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
        <div className="flex flex-wrap mb-6 border-b border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'join'
                ? 'text-blue-600 border-blue-500 dark:text-blue-300 dark:border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <UserCheck size={18} />
            Join a Family
          </button>

          <button
            onClick={() => setActiveTab('create')}
            disabled={hasCreatedFamily}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              hasCreatedFamily
                ? 'text-gray-400 border-transparent cursor-not-allowed dark:text-gray-600'
                : activeTab === 'create'
                ? 'text-blue-600 border-blue-500 dark:text-blue-300 dark:border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Plus size={18} />
            Create a Family
          </button>

          <button
            onClick={() => setActiveTab('invite')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === 'invite'
                ? 'text-blue-600 border-blue-500 dark:text-blue-300 dark:border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <UserPlus size={18} />
            Invite Members
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'join' && <JoinFamily onJoinFamily={handleJoinFamily} />}
          {activeTab === 'create' && <CreateFamily onCreateFamily={handleCreateFamily} fetchFamilies={fetchFamilies} />}
          {activeTab === 'invite' && <InviteMember onInviteMember={handleInviteMember} creatorFamilyId={creatorFamilyId ?? ''} />}
        </div>
      </div>
    </div>
  );
};

export default ManageFamily;