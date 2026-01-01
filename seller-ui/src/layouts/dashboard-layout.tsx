import { DashboardSidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/header";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useSeller } from "@/hooks/use-user";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardLayout() {
  const { user, isSuccess } = useSeller()
  if (!user && isSuccess) {
    return <Navigate to="/auth/login" />
  }
  return (
    <SidebarProvider className="bg-sidebar">
      <DashboardSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <DashboardHeader />
          <ScrollArea className="w-full h-full">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}