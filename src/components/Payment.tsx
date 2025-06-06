"use client";

import { useState } from "react";

import BankTransferTab from "@/components/users/BankTransferTab";
import CryptomusTab from "@/components/users/CryptomusTab";
import DirectContactTab from "@/components/users/DirectContactTab";
import PayPalTab from "@/components/users/PayPalTab";
import { BadgeDollarSign, Coins, Headset, Landmark } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "bank",
    label: "Top up via bank card",
    icon: <Landmark color="#49e407" />,
    iconAlt: "ATM",
  },
  {
    id: "paypal",
    label: "Deposit via PayPal",
    icon: <BadgeDollarSign color="#72a1fd" />,
    iconAlt: "PayPal",
    disabled: true,
  },
  {
    id: "direct",
    label: "Contact directly",
    icon: <Headset />,
    iconAlt: "Liên hệ",
  },
  {
    id: "crypto",
    label: "Deposit via Cryptomus",
    icon: <Coins color="#9936a6" />,
    iconAlt: "Cryptomus",
    disabled: true,
  },
];

export default function PaymentPage() {
  const [activeTab, setActiveTab] = useState("bank");

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Deposit method</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            className={`
              border-2 rounded-xl p-4 flex items-center justify-between 
              ${method.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} transition-all
              ${
                activeTab === method.id
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
              }
            `}
            onClick={() => !method.disabled && setActiveTab(method.id)}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={activeTab === method.id}
                onChange={() => !method.disabled && setActiveTab(method.id)}
                disabled={method.disabled}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span
                className={`font-medium ${
                  activeTab === method.id ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                } ${method.disabled ? "text-gray-400 dark:text-gray-500" : ""}`}
              >
                {method.label}
              </span>
            </div>
            <div className="w-12 h-10 flex items-center justify-center">{method.icon}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {activeTab === "bank" && <BankTransferTab />}
        {activeTab === "paypal" && <PayPalTab />}
        {activeTab === "direct" && <DirectContactTab />}
        {activeTab === "crypto" && <CryptomusTab />}
      </div>
    </div>
  );
}
