import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        {children}
        <Toaster />
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
