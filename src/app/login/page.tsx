"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Định nghĩa schema cho form
const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string().min(1, {
    message: "Vui lòng nhập mật khẩu.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const successMessage = searchParams.get("success");
    if (successMessage) {
      setSuccess(successMessage);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setError(null);
      setSuccess(null);
      setIsSubmitting(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng nhập thất bại");
      }
      console.log("chuyển đến trang chủ");
      window.location.href = "/dashboard";
      // router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập để truy cập vào hệ thống</CardDescription>
        </CardHeader>

        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">{success}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
