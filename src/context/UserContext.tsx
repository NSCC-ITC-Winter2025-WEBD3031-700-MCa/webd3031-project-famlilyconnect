"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  profileImage: string | null;
  userEmail: string | null; 
  username: string | null;
  setProfileImage: (image: string | null) => void;
  setUsername: (username: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); 
  const [username, setUsername] = useState<string | null>(null);

  // Fetch user info from the database
  const fetchUserInfo = async (id: string) => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/profile/${id}`);
        const userData = await response.json();
   

        setProfileImage(userData.image || "/images/profile/default.jpg");
        setUsername(userData.name || null);
        setUserEmail(userData.email || null);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    }
  };

  // Fetch user info when session changes
  useEffect(() => {
    // @ts-ignore - if you're certain the ID exists at runtime
    if (session?.user?.id) {
      // @ts-ignore
      fetchUserInfo(session.user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  return (
    <UserContext.Provider 
      value={{ 
        profileImage, 
        userEmail, 
        username, 
        setProfileImage, 
        setUsername, 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};