import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BankConfig } from "@/types/month";
import { Copy, CreditCard, User } from "lucide-react";
import { toast } from "react-toastify";


interface BankInfoCardProps {
  bankConfig: BankConfig;
}

export function BankInfoCard({ bankConfig }: BankInfoCardProps) {
  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankConfig.accountNumber);
    toast.success("Đã sao chép số tài khoản");
  };

  return (
    <Card className="bg-blue-800 dark:bg-blue-900 text-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{bankConfig.bankName} Bank</h3>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-full bg-yellow-300"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-100"></div>
          </div>
        </div>
        <p className="text-sm text-blue-200 dark:text-blue-300 mb-6">Account information</p>

        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-300">
              <CreditCard size={16} />
              <span className="text-sm">Account number</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xl">{bankConfig.accountNumber}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-blue-300 hover:text-white hover:bg-blue-700 dark:hover:bg-blue-800 rounded-full"
                onClick={handleCopyAccountNumber}
              >
                <Copy size={14} />
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-300">
              <User size={16} />
              <span className="text-sm">Account name</span>
            </div>
            <p className="font-medium text-lg uppercase">{bankConfig.accountName}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
