"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LogIn } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  password: z.string().min(1, {
    message: "Vui lòng nhập mật khẩu.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
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

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res?.ok) {
        const session = await getSession();
        if (session?.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/audio");
        }
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-0 mt-16 z-10">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="inline-flex mx-auto items-center justify-center p-2 rounded-full bg-primary/10 text-primary mb-2">
          <LogIn className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Login to access the system</CardDescription>
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
              Password
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
              {isSubmitting ? "Processing..." : "Login"}
              {!isSubmitting && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-right">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don`t have an account?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
