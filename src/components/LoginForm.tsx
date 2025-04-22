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
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email.",
  }),
  password: z.string().min(1, {
    message: "Please enter password.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await signIn("google", { callbackUrl: window.location.origin });
    } catch (err: unknown) {
      setError((err as Error).message || "Đăng nhập Google thất bại. Vui lòng thử lại.");
      setIsGoogleLoading(false);
    }
  };

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
        <div className="relative my-6">
          <Separator />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
            OR
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            "Connecting..."
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 186.69 190.5"
                className="mr-1 h-4 w-4"
              >
                <g transform="translate(1184.583 765.171)">
                  <path
                    d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
                    fill="#4285f4"
                  />
                  <path
                    d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
                    fill="#34a853"
                  />
                  <path
                    d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.695-24.592 31.695-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
                    fill="#fbbc05"
                  />
                  <path
                    d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
                    fill="#ea4335"
                  />
                </g>
              </svg>
              Sign in with Google
            </>
          )}
        </Button>
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
