"use client"
import { Calendar, Home, Inbox, Search, Settings, LogOut, ArrowBigLeft } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useEffect } from "react"
import { useSession } from "next-auth/react"



// Menu items.
const items = [
  {
    title: "Back to FamConnect",
    url: "/",
    icon: ArrowBigLeft
  },
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Members",
    url: "/admin/members",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

]

export function AppSidebar() {
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
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    <NavUser user={{ name: session?.user?.name || "Admin", email: session?.user?.email || "Email not found", avatar: "path/to/avatar.png" }} />
      
    </Sidebar>
  )
}
