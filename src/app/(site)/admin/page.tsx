"use client";
import { Card } from "@/components/ui/card"
import { UserEngagementCard } from "@/components/admin/user-engagement"
import { TrafficPatternsCard } from "@/components/admin/traffic-patterns"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Admin Page | Family Connect – Bringing Loved Ones Closer",
  icons: {
    icon: "images/favicon.ico",
  },
};


export default function Dashboard() {

  const { data: session, status } = useSession(); // Getting the session data

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Logged in user:', session.user); // Log the logged-in user
    } else {
      console.log('User not logged in');
    }
  }, [status, session]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/members', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch members');
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    if (session?.user) {
      fetchData(); // Fetch data only if user is authenticated
    }
  }, [session]);


  return (
    <div className="ps-10 pt-5">
      <div className="px-28 py-10 border rounded-lg shadow-1">
      <div>
        <h1 className="text-[28px] font-bold">Welcome, {session?.user?.name || "Admin"}! 👋</h1>
      </div>
      {/* top cards  */}
      <div className="grid grid-cols-3 gap-10 mt-5">
        <Card className="bg-white px-5 py-1">
          <div>
            <h2 className="text-[20px] font-bold">Total Users</h2>
            <p className="text-[14px] text-muted-foreground">10,000</p>
          </div>
        </Card>
        <Card className="bg-white px-5 py-1">
          <div>
            <h2 className="text-[20px] font-bold">Total Orders</h2>
            <p className="text-[14px] text-muted-foreground">1,000</p>
          </div>
        </Card>
        <Card className="bg-white px-5 py-1">
          <div>
            <h2 className="text-[20px] font-bold">Total Revenue</h2>
            <p className="text-[14px] text-muted-foreground">$100,000</p>
          </div>
        </Card>
      </div>
      {/* user engagement card  */}
      <div className="pt-2">
        <UserEngagementCard />
      </div>

      {/* traffic patterns card  */}
      <div className="pt-2">
        <TrafficPatternsCard />
      </div>
      
      </div>
      </div>
  )
}