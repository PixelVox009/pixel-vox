"use client";
import { Bell, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export function AdminHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  // Determine the current page title based on pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean);
    if (path.length < 3) return "Dashboard";

    // Capitalize the last part of the path
    const lastPart = path[path.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-xl dark:bg-gray-950/80 px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </Button>
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={toggleTheme} className="hover:bg-secondary">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
