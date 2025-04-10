"use client";

import PixelVoxLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Compass, Menu, MessageSquare, Mic2, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items
  const navItems = [
    { icon: <Compass size={20} />, label: "Explore", href: "/explore" },
    { icon: <MessageSquare size={20} />, label: "Text to Speech", href: "/text-to-speech" },
    { icon: <Mic2 size={20} />, label: "Voices", href: "/voices" },
    { icon: <VolumeX size={20} />, label: "Voice Isolator", href: "/voice-isolator" },
  ];

  // Sidebar content component - used in both desktop and mobile versions
  const SidebarContent = ({ showCloseButton = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo and brand */}
      <div className="p-4 dark:border-gray-800 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <PixelVoxLogo width={150} height={60} />
        </Link>

        {showCloseButton && (
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <X size={18} />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetClose>
        )}
      </div>

      {/* Navigation links */}
      <nav className=" flex-1 mx-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2 rounded-md
                    ${
                      isActive
                        ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer links */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <div className="space-y-2">
          <Link href="/about" className="block hover:text-gray-700 dark:hover:text-gray-300">
            About PixelVox
          </Link>
          <Link href="/terms" className="block hover:text-gray-700 dark:hover:text-gray-300">
            Terms of Service
          </Link>
          <Link href="/privacy" className="block hover:text-gray-700 dark:hover:text-gray-300">
            Privacy Policy
          </Link>
          <div className="pt-2">@PixelVox 2025</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-[300px] min-h-screen border-r border-gray-200 dark:border-gray-800 flex-col flex-shrink-0">
        <SidebarContent showCloseButton={false} />
      </div>

      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 shadow-md bg-white dark:bg-gray-800"
            >
              <Menu size={20} />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 border-r border-gray-200 dark:border-gray-800">
            <SidebarContent showCloseButton={true} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
