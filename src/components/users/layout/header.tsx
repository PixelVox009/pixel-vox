"use client";

import { Flower, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useTokenData } from "@/hooks/useHeader";
import CreditsDashboard from "./CreditsDashboard";


export default function Header() {
  const [activeTransactionTab, setActiveTransactionTab] = useState("all");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { tokenBalance } = useTokenData(activeTransactionTab);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleBuyCredits = () => {
    router.push("/credits");
  };

  const handleTabChange = (tab: string) => {
    setActiveTransactionTab(tab);
  };

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
          <CreditsDashboard
            activeTab={activeTransactionTab}
            onTabChange={handleTabChange}
            onBuyCredits={handleBuyCredits}
          />
        </Dialog>

        <Button variant="outline" size="icon" onClick={toggleTheme} className="hover:bg-secondary">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
