"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useExchangeRates } from "@/utils/formatVndUseDola";
import { UserData } from "@/types/users";
import { fetchUsers, giftTokensToUser } from "./transactions";
import { SearchAndFilterBar } from "@/components/admin/SearchAndFilterBar";
import { UsersTable } from "@/components/admin/UsersTable";
import { Pagination } from "@/components/admin/Pagination";
import { GiftTokenModal } from "@/components/admin/GiftTokenModal";
import { toast } from "react-toastify";


export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isGiftTokenModalOpen, setIsGiftTokenModalOpen] = useState(false);
  const [tokensToGift, setTokensToGift] = useState(0);
  const [giftDescription, setGiftDescription] = useState("");
  const [isGiftingTokens, setIsGiftingTokens] = useState(false);
  const { rates } = useExchangeRates();
  const queryClient = useQueryClient();

  // Fetch users with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: () => fetchUsers(page, limit, search, role),
  });

  const handleRoleChange = (value: string) => {
    const roleFilter = value === "all" ? "" : value;
    setRole(roleFilter);
    setPage(1);
    refetch();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleOpenGiftModal = (user: UserData) => {
    setSelectedUser(user);
    setIsGiftTokenModalOpen(true);
    setTokensToGift(0);
    setGiftDescription("");
  };

  const handleGiftTokens = async () => {
    if (!selectedUser || tokensToGift <= 0 || !selectedUser.wallet) return;

    setIsGiftingTokens(true);
    try {
      await giftTokensToUser(
        selectedUser._id,
        selectedUser.wallet._id,
        tokensToGift,
        giftDescription || `Admin tặng ${tokensToGift} credits`
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsGiftTokenModalOpen(false);
      setTokensToGift(0);
      setGiftDescription("");
      toast.success(`Đã tặng thành công ${tokensToGift} credits cho ${selectedUser.name}`);
    } catch (error) {
      console.error("Error gifting tokens:", error);
      toast.error("Không thể tặng credits. Vui lòng thử lại.");
    } finally {
      setIsGiftingTokens(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>New user</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2 text-sm">
        <Button variant="link" className="p-0">
          Dashboard
        </Button>
        <span>/</span>
        <Button variant="link" className="p-0">
          User
        </Button>
        <span>/</span>
        <span className="text-muted-foreground">List</span>
      </div>

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
            data={data?.users || []}
            isLoading={isLoading}
            error={error}
            onGift={handleOpenGiftModal}
            vndToUsdRate={rates.vndToUsdRate}
          />

          <Pagination
            page={page}
            limit={limit}
            totalPages={data?.pagination?.totalPages || 1}
            total={data?.pagination?.total || 0}
            from={data?.pagination?.from || 0}
            to={data?.pagination?.to || 0}
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
