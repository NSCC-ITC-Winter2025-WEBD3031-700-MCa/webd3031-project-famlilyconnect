"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import { usePathname } from "next/navigation";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Check if it's an admin page
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html suppressHydrationWarning={true} className="!scroll-smooth" lang="en">
      <head />
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <SessionProvider>
            <UserProvider>
              <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
                <ToasterContext />
                
                {/* Show header & footer only if NOT an admin route */}
                {!isAdminRoute && <Header />}
                {children}
                {!isAdminRoute && <Footer />}
                
                <ScrollToTop />
              </ThemeProvider>
            </UserProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
