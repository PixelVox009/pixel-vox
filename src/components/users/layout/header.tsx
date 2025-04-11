"use client";
import { Mic, Image as ImageIcon, Video, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import {
  Flower,
  Image as ImageIcon,
  Mic,
  Moon,
  Sun,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Định nghĩa các interface
interface TokenBalance {
  balance: number;
  totalRecharged: number;
  totalSpent: number;
  totalTokens: number;
}

interface Transaction {
  _id: string;
  type: string;
  description: string;
  tokensEarned: number;
  amount: number;
  createdAt: string;
}

interface CreditsDetails {
  remaining: number;
  membership: number;
  topup: number;
  bonus: number;
}

// Hằng số tỷ giá chuyển đổi
const VND_TO_USD_RATE = 25000; // 25,000 VND = 1 USD

// API functions
const fetchTokenBalance = async (): Promise<TokenBalance> => {
  const response = await fetch("/api/user/token");
  if (!response.ok) {
    throw new Error("Failed to fetch token balance");
  }
  return response.json();
};

const fetchTransactionHistory = async (): Promise<Transaction[]> => {
  const response = await fetch("/api/user/transaction-history");
  if (!response.ok) {
    throw new Error("Failed to fetch transaction history");
  }
  const data = await response.json();
  return data.transactions || [];
};

export default function Header() {
  const [activeTab, setActiveTab] = useState("audio");
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Fetch token balance with React Query
  const { data: balanceData, isLoading: isBalanceLoading } =
    useQuery<TokenBalance>({
      queryKey: ["tokenBalance"],
      queryFn: fetchTokenBalance,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    });

  // Fetch transaction history with React Query
  const { data: transactionHistory = [], isLoading: isHistoryLoading } =
    useQuery<Transaction[]>({
      queryKey: ["transactionHistory"],
      queryFn: fetchTransactionHistory,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    });

  // Calculate credits details
  const creditsDetails: CreditsDetails | null = balanceData
    ? {
        remaining: balanceData.balance || 0,
        membership: 0, // Adjust as needed
        topup: balanceData.totalRecharged || 0,
        bonus: Math.max(
          0,
          (balanceData.balance || 0) - (balanceData.totalRecharged || 0)
        ),
      }
    : null;

  const isLoading = isBalanceLoading || isHistoryLoading;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleBuyCredits = () => {
    router.push("/credits");
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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  // Chuyển đổi VND sang USD
  const formatVndToUsd = (vndAmount: number) => {
    const usdAmount = vndAmount / VND_TO_USD_RATE;
    return `$${usdAmount.toFixed(2)}`;
  };

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
