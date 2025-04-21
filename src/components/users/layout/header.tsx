"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useTokenStore } from "@/lib/store";
import { Flower, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { tokenBalance } = useTokenStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-end border-b bg-white/80 backdrop-blur-xl dark:bg-gray-950/80 px-4">
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1 px-3 h-9">
              <Flower size={16} color="#b83fd9" />
              <span className="text-base font-medium">{tokenBalance}</span>
            </Button>
          </DialogTrigger>
        </Dialog>

        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
