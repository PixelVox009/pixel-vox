"use client";

import { Compass, ImagePlus, Landmark, type LucideIcon } from "lucide-react";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: {
  name: string;
  url: string;
  icon: LucideIcon;
}[] = [
  { name: "Audio", url: "/audio", icon: Compass },
  { name: "Image", url: "/image", icon: ImagePlus },
  { name: "Credits", url: "/credits", icon: Landmark },
];

export function NavProjects() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audio Tools</div>
      <SidebarMenu>
        {navItems.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 w-full group py-3 px-4 rounded-lg transition-colors
                    ${isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary/50"}
                  `}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors
                      ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}
                    `}
                  />
                  <span
                    className={`truncate text-base font-medium transition-colors
                      ${isActive ? "text-primary font-semibold" : "group-hover:text-foreground"}
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
