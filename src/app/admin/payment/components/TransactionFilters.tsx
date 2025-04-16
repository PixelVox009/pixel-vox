import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, Download, Search } from "lucide-react";
import { typeOptions } from "../../../../hooks/useTransactions";

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  startDate: Date;
  setStartDate: (d: Date) => void;
  endDate: Date;
  setEndDate: (d: Date) => void;
  handleSearch: () => void;
  handleExport: () => void;
}

export function TransactionFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleSearch,
  handleExport,
}: TransactionFiltersProps) {
  const formatDateRange = () => {
    if (!startDate || !endDate) return "Select date range";
    return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Transaction Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-2">
            Transaction Type
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: startDate,
                  to: endDate,
                }}
                onSelect={(range) => {
                  setStartDate(range?.from || subDays(new Date(), 30));
                  setEndDate(range?.to || new Date());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Export button - desktop */}
        <div className="hidden lg:flex items-end">
          <Button variant="outline" size="default" className="w-full flex items-center gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      {/* Search row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transaction..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button type="button" onClick={handleSearch} className="bg-slate-900 min-w-[100px]">
          Search
        </Button>
        {/* Export button - mobile */}
        <Button
          variant="outline"
          size="default"
          className="lg:hidden flex items-center justify-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}