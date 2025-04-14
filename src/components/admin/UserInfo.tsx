"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Định nghĩa kiểu cho User
interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  wallet?: {
    balance?: number;
  };
}

// Định nghĩa kiểu cho Pagination
interface Pagination {
  total: number;
  page: number;
  limit: number;
  from: number;
  to: number;
  totalPages: number;
}

export default function UserContactsCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 3,
    from: 1,
    to: 3,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

 const fetchUsers = useCallback(
   async (page = 1) => {
     setLoading(true);
     try {
       const params = new URLSearchParams({
         page: page.toString(),
         limit: pagination.limit.toString(),
         role: "user",
       });

       const response = await fetch(`/api/admin/users?${params.toString()}`);

       if (response.ok) {
         const data = await response.json();
         setUsers(data.users);
         setPagination(data.pagination);
       } else {
         console.error("Lỗi khi lấy danh sách người dùng");
       }
     } catch (error) {
       console.error("Lỗi khi gọi API:", error);
     } finally {
       setLoading(false);
     }
   },
   [pagination.limit]
 );
  useEffect(() => {
    fetchUsers(); // gọi lần đầu khi component render
  }, [fetchUsers]);
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatBalance = (amount?: number) => {
    return amount?.toLocaleString("vi-VN") || "0";
  };

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchUsers(newPage);
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="dark:text-gray-200">Danh sách người dùng</CardTitle>
            <CardDescription className="dark:text-gray-400">Bạn có {pagination.total} người dùng</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 dark:text-gray-300 dark:hover:bg-gray-700">
            Xem tất cả
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw size={24} className="animate-spin text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="dark:bg-gray-600 dark:text-gray-300">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Số dư</div>
                      <div className="font-medium">{formatBalance(user.wallet?.balance)} Token</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-gray-300 dark:hover:bg-gray-600">
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Không tìm thấy người dùng nào</div>
            )}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị {pagination.from}-{pagination.to} trên {pagination.total}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                disabled={pagination.page === 1}
                onClick={() => changePage(pagination.page - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="px-3 py-1 text-sm dark:text-gray-300">
                {pagination.page} / {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => changePage(pagination.page + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
