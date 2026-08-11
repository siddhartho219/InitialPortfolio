"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCmsRoute = pathname === "/login" || pathname.startsWith("/dashboard");

  if (isCmsRoute) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </SmoothScrollProvider>
  );
}
