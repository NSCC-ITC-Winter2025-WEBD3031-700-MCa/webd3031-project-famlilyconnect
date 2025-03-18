'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideSidebar = pathname === '/admin/signin';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {!hideSidebar && <AppSidebar />}

        {/* Main Content */}
        <main
          className={
            hideSidebar
              ? 'flex-1 flex items-center justify-center min-h-screen' // center content
              : 'flex-1 p-6' // default styling
          }
        >
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
