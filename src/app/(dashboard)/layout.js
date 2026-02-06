"use client";
import AppSidebar from "@/components/app-sidebbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4 min-h-screen ">
        <div className="flex items-start">
          {/* Trigger di luar AppSidebar */}
          <SidebarTrigger className="mr-2" />
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
