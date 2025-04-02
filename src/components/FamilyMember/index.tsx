"use client";

import { User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Member {
  id: string;
  userId: string;
  role: "admin" | "editor" | "viewer";
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: Date;
}

interface FamilyMembersProps {
  members: Member[];
  currentUserId: string;
  familyId: string;
  onMemberRemoved: (memberId: string) => void;
  onRoleChanged: (memberId: string, newRole: "admin" | "editor" | "viewer") => void;
}

const roleDescriptions = {
  admin: "Can manage members and all content",
  editor: "Can create and edit content",
  viewer: "Can only view content",
};

const FamilyMember = ({
  members,
  currentUserId,
  familyId,
  onMemberRemoved,
  onRoleChanged,
}: FamilyMembersProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [memberNameToRemove, setMemberNameToRemove] = useState<string>("");

  const currentUserRole = members.find(
    (member) => member.userId === currentUserId
  )?.role;

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (isProcessing) return;
    setMemberToRemove(memberId);
    setMemberNameToRemove(memberName);
    setShowConfirmModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/family/${familyId}/member/${memberToRemove}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to remove member");
      }

      toast.success("Member removed successfully", { position: "top-center" });
      onMemberRemoved(memberToRemove);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member", { position: "top-center" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangeRole = async (memberId: string, newRole: "admin" | "editor" | "viewer") => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch(`/api/family/${familyId}/member/${memberId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error('Failed to change role');
      }
      
      toast.success("Role updated successfully");
      onRoleChanged(memberId, newRole);
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error("Failed to update role");
    } finally {
      setIsProcessing(false);
    }
  };

  // Only admin can manage members
  const canManageMembers = currentUserRole === "admin";

  return (
    <section>
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-red-500 dark:text-red-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Remove Family Member
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Are you sure you want to remove <span className="font-semibold">{memberNameToRemove}</span> from this family?
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone.
              </p>
            </div>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing}
                className="min-w-24 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveMember}
                disabled={isProcessing}
                className="min-w-24 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Family Members ({members.length})
        </h2>
      </div>

      <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <h3 className="mb-2 font-medium text-blue-800 dark:text-blue-200">
          Role Permissions:
        </h3>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
          {Object.entries(roleDescriptions).map(([role, description]) => (
            <li key={role} className="flex items-start">
              <span className="mr-2 inline-block w-16 rounded bg-blue-100 px-2 py-0.5 text-center text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                {role}
              </span>
              <span>{description}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
            {members.map((member) => {
              const isCurrentMember = member.userId === currentUserId;
              const canEdit = canManageMembers && !isCurrentMember;
              const memberName = member.user?.name || member.user?.email || "Unknown Member";

              return (
                <div
                  key={member.id}
                  className="group relative flex items-start rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative mr-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700">
                    <span className="text-xl font-bold text-white">
                      {(member.user?.name || member.user?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        member.role === "admin"
                          ? "bg-emerald-500"
                          : member.role === "editor"
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      }`}
                    ></span>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="line-clamp-1 text-lg font-semibold text-gray-800 dark:text-white">
                          {memberName}
                          {isCurrentMember && (
                            <span className="ml-2 text-sm text-gray-500">(You)</span>
                          )}
                        </h3>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <select
                            value={member.role}
                            onChange={(e) => 
                              handleChangeRole(
                                member.id, 
                                e.target.value as "admin" | "editor" | "viewer"
                              )
                            }
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            disabled={isProcessing}
                          >
                            <option value="admin">admin</option>
                            <option value="editor">editor</option>
                            <option value="viewer">viewer</option>
                          </select>
                          <button
                            className="rounded-full p-1.5 text-gray-400 opacity-0 transition-opacity duration-200 hover:bg-gray-100 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-gray-700 dark:hover:text-red-400"
                            aria-label="Remove member"
                            onClick={() => handleRemoveMember(member.id, memberName)}
                            disabled={isProcessing}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          member.role === "admin"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : member.role === "editor"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {member.role}
                        {member.role === "admin" && (
                          <svg
                            className="ml-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-16 transition-all duration-300 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 hover:dark:border-gray-600">
            <div className="mb-5 rounded-full bg-gray-100 p-5 shadow-inner dark:bg-gray-700">
              <User
                size={28}
                className="text-gray-400 dark:text-gray-300"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
              No members in this family
            </h3>
            <p className="mb-6 max-w-md text-center text-gray-500 dark:text-gray-400">
              Invite family members to join this family group.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FamilyMember;