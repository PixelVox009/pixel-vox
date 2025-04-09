"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Calendar } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm hidden md:block p-4">
        <div className="flex flex-col h-full">
          <div className="py-4 mb-6 border-b">
            <h1 className="text-2xl font-bold text-primary">My App</h1>
          </div>

          <nav className="flex-1 space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Trang chủ
            </Button>
          </nav>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" className="md:hidden" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {user && (
          <Card className="max-w-2xl">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>Thông tin tài khoản</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">
                Chỉnh sửa hồ sơ
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
