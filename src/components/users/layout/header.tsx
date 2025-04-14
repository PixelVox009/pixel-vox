"use client";

import { Flower, Image as ImageIcon, Mic, Moon, Sun, Video } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { formatVndToUsd, useExchangeRates } from "@/utils/formatVndUseDola";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

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
  tokensEarned?: number;
  tokensUsed?: number;
  amount: number;
  createdAt: string;
  oldBalance?: number;
  newBalance?: number;
}

interface CreditsDetails {
  remaining: number;
  membership: number;
  topup: number;
  bonus: number;
}

// API functions
const fetchTokenBalance = async (): Promise<TokenBalance> => {
  const response = await fetch("/api/user/token");
  if (!response.ok) {
    throw new Error("Failed to fetch token balance");
  }
  return response.json();
};

const fetchTransactionHistory = async (type: string = "all"): Promise<Transaction[]> => {
  const response = await fetch(`/api/user/transaction-history?type=${type}&limit=20`);
  if (!response.ok) {
    throw new Error("Failed to fetch transaction history");
  }
  const data = await response.json();
  return data.transactions || [];
};

export default function Header() {
  const [activeTab, setActiveTab] = useState("audio");
  const [activeTransactionTab, setActiveTransactionTab] = useState("all");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { rates } = useExchangeRates();

  // Fetch token balance with React Query
  const { data: balanceData, isLoading: isBalanceLoading } = useQuery<TokenBalance>({
    queryKey: ["tokenBalance"],
    queryFn: fetchTokenBalance,
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });

  // Fetch transaction history with React Query
  const { data: transactionHistory = [], isLoading: isHistoryLoading } = useQuery<Transaction[]>({
    queryKey: ["transactionHistory", activeTransactionTab],
    queryFn: () => fetchTransactionHistory(activeTransactionTab),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 minute
  });

  const pathname = usePathname();

  // Calculate credits details
  const creditsDetails: CreditsDetails | null = balanceData
    ? {
        remaining: balanceData.balance || 0,
        membership: 0, // Adjust as needed
        topup: balanceData.totalRecharged || 0,
        bonus: Math.max(0, (balanceData.balance || 0) - (balanceData.totalRecharged || 0)),
      }
    : null;

  const isLoading = isBalanceLoading || isHistoryLoading;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleBuyCredits = () => {
    router.push("/credits");
  };

  const handleTabChange = (tab: string) => {
    setActiveTransactionTab(tab);
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
      href: "/video",
      icon: <Video className="w-5 h-5" />,
    },
  ];

  const transactionTabs = [
    { id: "all", label: "All" },
    { id: "purchased", label: "Purchased" },
    { id: "bonus", label: "Bonus" },
  ];

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

  const getTokenChange = (transaction: Transaction) => {
    if (transaction.tokensEarned && transaction.tokensEarned > 0) {
      return `+${transaction.tokensEarned.toLocaleString()}`;
    }
    if (transaction.tokensUsed && transaction.tokensUsed > 0) {
      return `-${transaction.tokensUsed.toLocaleString()}`;
    }
    if (transaction.oldBalance !== undefined && transaction.newBalance !== undefined) {
      const diff = transaction.newBalance - transaction.oldBalance;
      return diff >= 0 ? `+${diff.toLocaleString()}` : `${diff.toLocaleString()}`;
    }
    return "0";
  };

  const getTokenColor = (transaction: Transaction) => {
    if (transaction.tokensEarned && transaction.tokensEarned > 0) {
      return "text-green-500";
    }
    if (transaction.tokensUsed && transaction.tokensUsed > 0) {
      return "text-red-500";
    }
    if (transaction.oldBalance !== undefined && transaction.newBalance !== undefined) {
      return transaction.newBalance >= transaction.oldBalance ? "text-green-500" : "text-red-500";
    }
    return "text-gray-500";
  };

  const getTransactionTitle = (transaction: Transaction) => {
    if (transaction.description) return transaction.description;
    if (transaction.type === "bank") return "Top-up Credits";
    if (transaction.type === "token_usage") return "Used Credits";
    if (transaction.type === "bonus") return "Bonus Credits";
    return "Transaction";
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
            <Button variant="outline" className="flex items-center gap-1 px-3 h-9">
              <Flower size={16} color="#b83fd9" />
              <span className="text-xl font-medium">{isLoading ? "..." : balanceData?.balance.toLocaleString()}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Credits Dashboard</DialogTitle>
            </DialogHeader>
            {creditsDetails && (
              <div className="space-y-6">
                {/* Credits Summary */}
                <div className="grid grid-cols-7 gap-2 text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="col-span-2 text-left">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Remaining Credits</div>
                    <div className="text-xl font-semibold text-purple-500">
                      {creditsDetails.remaining.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">=</div>
                  <div className="col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Membership Credits</div>
                    <div className="font-medium">{creditsDetails.membership.toLocaleString()}</div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">+</div>
                  <div className="col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Top-up Credits</div>
                    <div className="font-medium">{formatVndToUsd(creditsDetails.topup, rates.vndToUsdRate)}$</div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">+</div>
                  <div className="col-span-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Bonus Credits</div>
                    <div className="font-medium">{creditsDetails.bonus.toLocaleString()}</div>
                  </div>
                </div>

                {/* Transaction Tabs */}
                <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                  {transactionTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors
                        ${
                          activeTransactionTab === tab.id
                            ? "bg-white dark:bg-gray-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Transaction History List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {isHistoryLoading ? (
                    <div className="text-center py-4 text-gray-500">Loading transactions...</div>
                  ) : transactionHistory.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No transactions found</div>
                  ) : (
                    transactionHistory.map((transaction) => (
                      <div key={transaction._id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{getTransactionTitle(transaction)}</div>
                            <div className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</div>
                          </div>
                          <div className={`font-semibold ${getTokenColor(transaction)}`}>
                            {getTokenChange(transaction)} credits
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* USD Conversion Note */}
                <div className="text-xs text-gray-500 text-center">
                  <p>10 credit = $1 = {rates.vndToUsdRate} VND</p>
                </div>
                <div className="flex justify-end pt-4">
                  <DialogClose asChild>
                    <Button onClick={handleBuyCredits} className="bg-purple-600 hover:bg-purple-700">
                      Buy Credits
                    </Button>
                  </DialogClose>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Button variant="outline" size="icon" onClick={toggleTheme} className="hover:bg-secondary">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
