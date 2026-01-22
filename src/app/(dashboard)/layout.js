import AppSidebar from "@/components/app-sidebbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
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
