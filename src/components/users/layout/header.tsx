"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Image as ImageIcon, Link, Mic, Moon, Plus, Sun, Video } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

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
      icon: <Mic className="w-5 h-5" />,
    },
    {
      id: "image",
      label: "Image",
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      id: "video",
      label: "Video",
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
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2"
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/credits">
          {" "}
          <Button>
            <Plus />
            Credits
          </Button>
        </Link>
        <Button variant="outline" size="icon" onClick={toggleTheme} className="hover:bg-secondary">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
