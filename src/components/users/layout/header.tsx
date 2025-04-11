"use client";

import {
  Mic,
  Image as ImageIcon,
  Video,
  Sun,
  Moon,
  Flower,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 px-3 h-9"
            >
              <Flower size={16} color="#b83fd9" />
              <span className="text-xl font-medium">
                {isLoading ? "..." : balanceData?.balance.toLocaleString()}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Itemized Bills</DialogTitle>
            </DialogHeader>

            {creditsDetails && (
              <div className="space-y-6">
                {/* Credits Summary */}
                <div className="grid grid-cols-9 gap-2 text-center">
                  <div className="col-span-2 text-left">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Remaining Credits
                    </div>
                    <div className="text-xl font-semibold text-purple-500">
                      {creditsDetails.remaining.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    =
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Membership Credits
                    </div>
                    <div className="font-medium">
                      {creditsDetails.membership.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    +
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Top-up Credits
                    </div>
                    <div className="font-medium">
                      {formatVndToUsd(creditsDetails.topup)}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    +
                  </div>
                  <div className="col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Bonus Credits
                    </div>
                    <div className="font-medium">
                      {creditsDetails.bonus.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Credits History */}
                <div className="space-y-4 mt-4">
                  {transactionHistory.length > 0 ? (
                    transactionHistory.map((transaction, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">
                            {transaction.type === "bank"
                              ? "Top-up Credits"
                              : transaction.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </div>
                          {transaction.amount > 0 && (
                            <div className="text-xs text-gray-400">
                              {formatVndToUsd(transaction.amount)}
                            </div>
                          )}
                        </div>
                        <div
                          className={`font-semibold ${
                            transaction.tokensEarned > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.tokensEarned > 0 ? "+" : ""}
                          {transaction.tokensEarned.toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500">
                      No transaction history
                    </div>
                  )}
                </div>

                {/* USD Conversion Note */}
                <div className="text-xs text-gray-500 text-center">
                  <p>1 credit = $1 = {VND_TO_USD_RATE.toLocaleString()} VND</p>
                </div>

                {/* Buy Credits Button */}
                <div className="flex justify-end pt-4">
                  <DialogClose asChild>
                    <Button
                      onClick={handleBuyCredits}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Buy Credits
                    </Button>
                  </DialogClose>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

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
