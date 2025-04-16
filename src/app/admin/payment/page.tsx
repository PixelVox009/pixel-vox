
"use client";
import { TransactionFilters } from "@/components/admin/TransactionFilters";
import { TransactionTable } from "@/components/admin/TransactionTable";
import { useTransactions } from "@/hooks/useTransactions";


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
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing page {page} of {totalPages} ({totalTransactions} transactions)
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || loading}
          >
            Previous
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
