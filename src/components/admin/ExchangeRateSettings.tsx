import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExchangeRates } from "@/types/month";
import { RefreshCw } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

// Định nghĩa kiểu props cho component
interface ExchangeRateSettingsProps {
  exchangeRates?: ExchangeRates;
  newExchangeRates: ExchangeRates;
  onExchangeRatesChange: (rates: ExchangeRates) => void;
  onUpdateRates: () => void;
  isUpdating: boolean;
  isLoading: boolean;
  formatCurrency: (amount?: number) => string;
}

export function ExchangeRateSettings({
  exchangeRates,
  newExchangeRates,
  onExchangeRatesChange,
  onUpdateRates,
  isUpdating,
  isLoading,
  formatCurrency,
}: ExchangeRateSettingsProps) {
  // Khởi tạo state local để đảm bảo giá trị luôn tồn tại
  const [localRates, setLocalRates] = useState<ExchangeRates>({
    usdToTokenRate: exchangeRates?.usdToTokenRate || 0,
    vndToUsdRate: exchangeRates?.vndToUsdRate || 0,
  });
  // Cập nhật local state khi exchangeRates thay đổi
  useEffect(() => {
    if (exchangeRates) {
      setLocalRates({
        usdToTokenRate: exchangeRates.usdToTokenRate || 0,
        vndToUsdRate: exchangeRates.vndToUsdRate || 0,
      });
    }
  }, [exchangeRates]);
  // Xử lý thay đổi tỉ giá USD sang Token
  const handleUsdToTokenRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value) || 0;
    onExchangeRatesChange({
      ...newExchangeRates,
      usdToTokenRate: newRate,
    });
  };

  // Xử lý thay đổi tỉ giá VND sang USD
  const handleVndToUsdRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRate = parseFloat(e.target.value) || 0;
    onExchangeRatesChange({
      ...newExchangeRates,
      vndToUsdRate: newRate,
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg dark:text-gray-200">Cài đặt tỉ giá</CardTitle>
        <CardDescription className="dark:text-gray-400">Cập nhật tỉ giá quy đổi</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Tỉ giá USD sang Token</label>
              <div>
                <Input
                  type="number"
                  value={newExchangeRates.usdToTokenRate || ""}
                  onChange={handleUsdToTokenRateChange}
                  min="0"
                  step="0.01"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />

                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Token/USD</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Hiện tại: 1 USD = {localRates.usdToTokenRate} Token
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Tỉ giá VND sang USD</label>
              <div>
                <Input
                  type="number"
                  value={newExchangeRates.vndToUsdRate || ""}
                  onChange={handleVndToUsdRateChange}
                  min="0"
                  step="0.01"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">VND/USD</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Hiện tại: 1 USD = {formatCurrency(localRates.vndToUsdRate)} VND
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={onUpdateRates}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật tỉ giá"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
