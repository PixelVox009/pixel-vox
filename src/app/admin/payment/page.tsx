"use client";
import { TransactionFilters } from "@/components/admin/TransactionFilters";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/useTransactions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaymentHistory() {
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    transactions,
    loading,
    page,
    totalPages,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    totalTransactions,
    rates,
    handlePageChange,
    handleSearch,
    handleExport,
  } = useTransactions();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
        <p className="text-muted-foreground">View your payment history and credits transactions</p>
      </div>
      <TransactionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleSearch={handleSearch}
        handleExport={handleExport}
      />
      <TransactionTable transactions={transactions} loading={loading} rates={rates} />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
            className="h-9 px-4 flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
            className="h-9 px-4 flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing page {page} of {totalPages} ({totalTransactions} transactions)
        </div>
      </div>
    </div>
  );
}
