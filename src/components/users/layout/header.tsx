"use client";
import { Mic, Image as ImageIcon, Video, Sun, Moon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  const [activeTab, setActiveTab] = useState("audio");
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const tabs = [
    {
      id: "audio",
      label: "Audio",
      href: "/audio",
      icon: <Mic className="w-5 h-5" />,
    },
    {
      id: "image",
      label: "Image",
      href: "/image",
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      id: "video",
      label: "Video",
      href: "/image",
      icon: <Video className="w-5 h-5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-xl dark:bg-gray-950/80 px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <nav className="flex items-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              asChild
              className="flex items-center gap-2"
            >
              <Link href={tab.href} onClick={() => setActiveTab(tab.id)}>
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="hover:bg-secondary"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
