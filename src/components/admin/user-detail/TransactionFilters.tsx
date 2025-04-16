import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { DateRange } from "react-day-picker";

interface TransactionFiltersProps {
  transactionType: string;
  setTransactionType: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export const TransactionFilters = ({
  transactionType,
  setTransactionType,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  handleSearch,
}: TransactionFiltersProps) => {
  return (
    <div className="px-6 pb-4 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="type" className="text-sm font-medium block mb-2">
            Transaction Type
          </label>
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bank">Bank Payment</SelectItem>
              <SelectItem value="token_usage">Credits Usage</SelectItem>
              <SelectItem value="bonus">Bonus</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="text-sm font-medium block mb-2">Date Range</label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="w-full md:w-auto">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transaction..."
              className="pl-9 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
    </div>
  );
};
