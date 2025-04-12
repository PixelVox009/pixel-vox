"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatVndToUsd } from "@/utils/formatVndUseDola";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Edit, Gift, MoreVertical, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Types
interface UserWallet {
  _id: string;
  customer: string;
  balance: number;
  totalRecharged: number;
  totalTokens: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  tokenBalance: number;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  paymentCode?: string;
  wallet?: UserWallet;
}

const fetchUsers = async (page = 1, limit = 10, search = "", role = "") => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    role,
  });

  const response = await fetch(`/api/admin/users?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

// API để tặng token cho người dùng
const giftTokensToUser = async (userId: string, walletId: string, tokens: number, description: string) => {
  const response = await fetch(`/api/admin/payments/gift`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: userId,
      wallet: walletId,
      tokensEarned: tokens,
      description,
      type: "bonus",
      status: "success",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to gift tokens");
  }

  return response.json();
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isGiftTokenModalOpen, setIsGiftTokenModalOpen] = useState(false);
  const [tokensToGift, setTokensToGift] = useState(0);
  const [giftDescription, setGiftDescription] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isGiftingTokens, setIsGiftingTokens] = useState(false);

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

  const handleRowSelect = (userId: string) => {
    setSelectedRows((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const handleSelectAll = () => {
    if (selectedRows.length === (data?.users?.length || 0)) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data?.users?.map((user: any) => user._id) || []);
    }
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
        giftDescription || `Admin tặng ${tokensToGift} token`
      );
      // Cập nhật dữ liệu
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsGiftTokenModalOpen(false);
      setTokensToGift(0);
      setGiftDescription("");

      // Thông báo thành công
      alert(`Đã tặng thành công ${tokensToGift} token cho ${selectedUser.name}`);
    } catch (error) {
      console.error("Error gifting tokens:", error);
      alert("Không thể tặng token. Vui lòng thử lại.");
    } finally {
      setIsGiftingTokens(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
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

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between mb-6">
            <div className="flex gap-2">
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="text-center">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === (data?.users?.length || 0) && data?.users?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Payment Code</TableHead>
                  <TableHead>Total Tokens</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Total Recharged</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-red-500">
                      Error loading users
                    </TableCell>
                  </TableRow>
                ) : data?.users?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.users?.map((user: UserData) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(user._id)}
                          onCheckedChange={() => handleRowSelect(user._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                            />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.paymentCode || "N/A"}</TableCell>
                      <TableCell>{user.wallet?.totalTokens || 0} tokens</TableCell>
                      <TableCell>{user.wallet?.totalSpent || 0} tokens</TableCell>
                      <TableCell>{formatVndToUsd(user.wallet?.totalRecharged || 0)} $</TableCell>
                      <TableCell className="font-medium">
                        <Badge>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenGiftModal(user)}>
                            <Gift className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {" "}
                                <DropdownMenuItem>
                                  <Link href={`/admin/users/${user._id}/transactions`}>View details</Link>
                                </DropdownMenuItem>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete user</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div>Rows per page:</div>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger className="h-8 w-16">
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <div>
                {data?.pagination?.from || 0}-{data?.pagination?.to || 0} of {data?.pagination?.total || 0}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data?.pagination?.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Tokens Modal */}
      <Dialog open={isGiftTokenModalOpen} onOpenChange={setIsGiftTokenModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bonus Token</DialogTitle>
            <DialogDescription>Bonus token use users {selectedUser?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="tokens" className="text-sm font-medium">
                Quantity tokens
              </label>
              <Input
                id="tokens"
                type="number"
                min="1"
                value={tokensToGift}
                onChange={(e) => setTokensToGift(parseInt(e.target.value) || 0)}
                placeholder="Quantity tokens"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={giftDescription}
                onChange={(e) => setGiftDescription(e.target.value)}
                placeholder="Ví dụ: Khuyến mãi, thưởng hoạt động,..."
              />
              <p className="text-sm text-muted-foreground">
                Description will be displayed in user's transaction history
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGiftTokenModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleGiftTokens} disabled={isGiftingTokens || tokensToGift <= 0}>
              {isGiftingTokens ? "Đang xử lý..." : "Tặng token"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
