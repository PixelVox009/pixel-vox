"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import { SearchAndFilterBar } from "@/components/admin/SearchAndFilterBar";
import { UsersTable } from "@/components/admin/UsersTable";
import { Pagination } from "@/components/admin/Pagination";
import { GiftTokenModal } from "@/components/admin/GiftTokenModal";
import { useUsers } from "@/hooks/useUsers";
import { useGiftTokens } from "@/hooks/useGiftTokens";
import { UserHeader } from "@/components/admin/UserHeader";


export default function UsersPage() {
  const { rates } = useExchangeRates();

  const {
    users,
    pagination,
    isLoading,
    error,
    page,
    limit,
    search,
    role,
    setSearch,
    setLimit,
    handleRoleChange,
    handleSearch,
    handlePageChange,
  } = useUsers();

  const {
    selectedUser,
    isGiftTokenModalOpen,
    tokensToGift,
    giftDescription,
    isGiftingTokens,
    setIsGiftTokenModalOpen,
    setTokensToGift,
    setGiftDescription,
    handleOpenGiftModal,
    handleGiftTokens,
  } = useGiftTokens();

  return (
    <div className="p-6 space-y-6">
      <UserHeader />

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <SearchAndFilterBar
            search={search}
            setSearch={setSearch}
            role={role}
            onRoleChange={handleRoleChange}
            onSearch={handleSearch}
          />

          <UsersTable
            data={users}
            isLoading={isLoading}
            error={error}
            onGift={handleOpenGiftModal}
            vndToUsdRate={rates.vndToUsdRate}
          />

          <Pagination
            page={page}
            limit={limit}
            totalPages={pagination?.totalPages || 1}
            total={pagination?.total || 0}
            from={pagination?.from || 0}
            to={pagination?.to || 0}
            onPageChange={handlePageChange}
            onLimitChange={setLimit}
          />
        </CardContent>
      </Card>

      <GiftTokenModal
        isOpen={isGiftTokenModalOpen}
        onOpenChange={setIsGiftTokenModalOpen}
        selectedUser={selectedUser}
        tokensToGift={tokensToGift}
        setTokensToGift={setTokensToGift}
        giftDescription={giftDescription}
        setGiftDescription={setGiftDescription}
        onGift={handleGiftTokens}
        isGifting={isGiftingTokens}
      />
    </div>
  );
}
