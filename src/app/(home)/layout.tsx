"use client";
import Providers from "@/components/providers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/users/layout/header";
import { AppSidebar } from "@/components/users/layout/side-bar";

import { ThemeProvider } from "next-themes";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <Header />
            <div className="">
              <Providers>{children}</Providers>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
