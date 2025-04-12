"use client";
import PixelVoxLogo from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CreditCard, Home, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { NavUser } from "../nav-user";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin/dashboard",
    },
    {
      title: "User Management",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users",
    },
    {
      title: "Payment Management",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/admin/payment",
    },
    {
      title: "Back to Home",
      icon: <Home className="h-5 w-5" />,
      path: "/audio",
    },
  ];
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="grid flex-1 text-left text-sm leading-tight mt-6 mb-2">
                  <PixelVoxLogo />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-4 truncate text-base transition-colors  font-semibold">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={pathname === item.path ? "bg-accent text-accent-foreground" : ""}>
                <Link href={item.path}>
                  {item.icon}
                  <span className="text-[16px] p-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
