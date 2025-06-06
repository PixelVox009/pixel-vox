"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function UserContactsCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "3",
        role: "user",
      });

      const response = await fetch(`/api/admin/users?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalUsers(data.pagination.total);
      } else {
        console.error("Lỗi khi lấy danh sách người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // gọi lần đầu khi component render
  }, []);

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

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="dark:text-gray-200">List of users</CardTitle>
            <CardDescription className="dark:text-gray-400 mt-2">You have {totalUsers} users</CardDescription>
          </div>
          <Link href="/admin/users">
            {" "}
            <Button variant="ghost" size="sm" className="gap-1 dark:text-gray-300 dark:hover:bg-gray-700">
              See all
              <ChevronRight size={16} />
            </Button>
          </Link>
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
                      <div className="text-sm text-gray-500 dark:text-gray-400">Balance</div>
                      <div className="font-medium">{formatBalance(user.wallet?.balance)} Token</div>
                    </div>
                    <Link href={`/admin/users/${user._id}/transactions`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 dark:text-gray-300 dark:hover:bg-gray-600">
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">No users found</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
