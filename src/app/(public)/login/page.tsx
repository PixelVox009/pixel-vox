"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import PixelVoxLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Image, LogIn, Music, Sparkles, Video } from "lucide-react";
import { signIn } from "next-auth/react";

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
  const [role, setRole] = useState<"user" | "admin">("user");
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

      // Thêm role vào request đăng nhập
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        role: role, 
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res?.ok) {
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/audio");
        }
      }
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Floating animated icons */}
      <div className="absolute h-full w-full">
        <div className="absolute top-[15%] left-[10%] text-blue-500 animate-bounce" style={{ animationDuration: "3s" }}>
          <Music className="h-8 w-8 opacity-20" />
        </div>
        <div
          className="absolute top-[30%] right-[15%] text-purple-500 animate-pulse"
          style={{ animationDuration: "4s" }}
        >
          <Image className="h-10 w-10 opacity-20" />
        </div>
        <div
          className="absolute bottom-[20%] left-[20%] text-pink-500 animate-bounce"
          style={{ animationDuration: "3.5s" }}
        >
          <Video className="h-9 w-9 opacity-20" />
        </div>
        <div
          className="absolute bottom-[25%] right-[10%] text-yellow-500 animate-pulse"
          style={{ animationDuration: "2.5s" }}
        >
          <Sparkles className="h-7 w-7 opacity-20" />
        </div>
      </div>

      {/* Header with logo */}
      <div className="absolute top-6 left-0 w-full flex justify-center">
        <Link href="/">
          <PixelVoxLogo width={180} height={70} />
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0 mt-16 z-10">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="inline-flex mx-auto items-center justify-center p-2 rounded-full bg-primary/10 text-primary mb-2">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập để truy cập vào hệ thống</CardDescription>
        </CardHeader>

        <CardContent>
          {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">{success}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
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

            <div className="space-y-2">
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

            <div className="pt-2">
              <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Đang xử lý..." : `Đăng nhập`}
                {!isSubmitting && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
