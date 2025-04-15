import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MonthlyData } from "@/types/month";
import { Calendar, RefreshCw } from "lucide-react";
import { ChangeEvent } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface TransactionChartProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onApplyFilters: () => void;
  isLoading: boolean;
  monthlyData?: MonthlyData[];
  vndToUsdRate: number;
  formatVndToUsd: (amount: number, rate: number) => string;
}

export function TransactionChart({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilters,
  isLoading,
  monthlyData,
  vndToUsdRate,
  formatVndToUsd,
}: TransactionChartProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg dark:text-gray-200">Trading chart</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Statistics from {startDate} to {endDate}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Input
                type="date"
                className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={startDate}
                onChange={onStartDateChange}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <Input
                type="date"
                className="w-full dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                value={endDate}
                onChange={onEndDateChange}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
            <Button
              className="w-full sm:w-auto dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={onApplyFilters}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Filter"
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          ) : monthlyData && monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: 20, bottom: 10 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="gray" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tick={{ fill: "gray" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "gray" }}
                  tickFormatter={(value) => `$${formatVndToUsd(value, vndToUsdRate)}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${formatVndToUsd(value, vndToUsdRate)}`, "USD"]}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="amount" name="Số tiền" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              No data for this period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
