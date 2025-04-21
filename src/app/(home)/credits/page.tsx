"use client";
import PaymentPage from "@/components/Payment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreditsDashboard from "@/components/users/layout/CreditsDashboard";
import { useState } from "react";

export default function CreditsAndPaymentTabs() {
  const [activeTransactionTab, setActiveTransactionTab] = useState("all");

  return (
    <div className="w-full px-4 py-6">
      <Tabs defaultValue="credits" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-4xl mx-auto mb-6">
          <TabsTrigger value="credits">By Credits</TabsTrigger>
          <TabsTrigger value="history">Credits History</TabsTrigger>
        </TabsList>

        <TabsContent value="credits">
          <div className="w-full mx-auto px-4">
            <PaymentPage />
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="w-full mx-auto px-4">
            <CreditsDashboard activeTab={activeTransactionTab} onTabChange={setActiveTransactionTab} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
