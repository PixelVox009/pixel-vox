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
    usdToTokenRate: exchangeRates?.usdToTokenRate ?? 0,
    vndToUsdRate: exchangeRates?.vndToUsdRate ?? 0,
    imageToTokenRate: exchangeRates?.imageToTokenRate ?? 5,
    minuteToTokenRate: exchangeRates?.minuteToTokenRate ?? 30,
  });

  // Cập nhật local state khi exchangeRates thay đổi
  useEffect(() => {
    if (exchangeRates) {
      setLocalRates({
        usdToTokenRate: exchangeRates.usdToTokenRate ?? 0,
        vndToUsdRate: exchangeRates.vndToUsdRate ?? 0,
        imageToTokenRate: exchangeRates.imageToTokenRate ?? 5,
        minuteToTokenRate: exchangeRates.minuteToTokenRate ?? 30,
      });
    }
  }, [exchangeRates]);

  const handleUsdToTokenRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newRate = value === "" ? 0 : parseFloat(value);

    onExchangeRatesChange({
      ...newExchangeRates,
      usdToTokenRate: newRate,
    });
  };

  const handleVndToUsdRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newRate = value === "" ? 0 : parseFloat(value);

    onExchangeRatesChange({
      ...newExchangeRates,
      vndToUsdRate: newRate,
    });
  };

  const handleImageToTokenRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newRate = value === "" ? 0 : parseFloat(value);

    onExchangeRatesChange({
      ...newExchangeRates,
      imageToTokenRate: newRate,
    });
  };

  const handleMinuteToTokenRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newRate = value === "" ? 0 : parseFloat(value);

    onExchangeRatesChange({
      ...newExchangeRates,
      minuteToTokenRate: newRate,
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg dark:text-gray-200">Exchange rate settings</CardTitle>
        <CardDescription className="dark:text-gray-400">Update exchange and token rates</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">VND to USD exchange rate</label>
              <div>
                <Input
                  type="number"
                  value={newExchangeRates.vndToUsdRate ?? ""}
                  onChange={handleVndToUsdRateChange}
                  min="0"
                  step="1"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">VND/USD</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Current: 1 USD = {formatCurrency(localRates.vndToUsdRate)} VND
                  </span>
                </div>
              </div>
            </div>

            {/* New fields for Image and Minute token rates */}
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Image to Token Rate</label>
              <div>
                <Input
                  type="number"
                  value={newExchangeRates.imageToTokenRate ?? ""}
                  onChange={handleImageToTokenRateChange}
                  min="0"
                  step="1"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Token/Image</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Current: 1 Image = {localRates.imageToTokenRate} Token
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-gray-300">Minute to Token Rate</label>
              <div>
                <Input
                  type="number"
                  value={newExchangeRates.minuteToTokenRate ?? ""}
                  onChange={handleMinuteToTokenRateChange}
                  min="0"
                  step="1"
                  className="dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Token/Minute</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Current: 1 Minute = {localRates.minuteToTokenRate} Token
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
                  Updating...
                </>
              ) : (
                "Update exchange rates"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
