"use client";

import PixelVoxLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Image, Music, Sparkles, UserPlus, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Định nghĩa schema cho form
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải chứa ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản để tiếp tục.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const termsValue = watch("terms");

  async function onSubmit(values: FormData) {
    try {
      setError(null);
      setIsSubmitting(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại");
      }

      router.push("/login?success=Đăng ký thành công");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden py-10">
      {/* Floating animated icons */}
      <div className="absolute h-full w-full">
        <div className="absolute top-[20%] left-[15%] text-blue-500 animate-float" style={{ animationDuration: "6s" }}>
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Music className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        <div
          className="absolute top-[25%] right-[20%] text-purple-500 animate-float"
          style={{ animationDuration: "8s", animationDelay: "1s" }}
        >
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Image className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
        </div>
        <div
          className="absolute bottom-[30%] left-[25%] text-pink-500 animate-float"
          style={{ animationDuration: "7s", animationDelay: "2s" }}
        >
          <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30">
            <Video className="h-6 w-6 text-pink-600 dark:text-pink-300" />
          </div>
        </div>
        <div
          className="absolute bottom-[20%] right-[15%] text-yellow-500 animate-float"
          style={{ animationDuration: "9s", animationDelay: "3s" }}
        >
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
          </div>
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
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Tạo tài khoản mới</CardTitle>
          <CardDescription>Đăng ký để bắt đầu trải nghiệm</CardDescription>
        </CardHeader>

        <CardContent>
          {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Họ tên
              </label>
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

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
                placeholder="Ít nhất 6 ký tự"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full gap-1.5" disabled={isSubmitting} size="lg">
                {isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}{" "}
                {!isSubmitting && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
