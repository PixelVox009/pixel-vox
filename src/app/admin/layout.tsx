import { AdminSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/header";
import Providers from "@/components/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
          <AdminSidebar />
          <div className="flex-1">
            {" "}
            <AdminHeader />
            <Providers>{children}</Providers>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
