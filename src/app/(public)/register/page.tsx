"use client";

import PixelVoxLogo from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { FloatingIcons } from "@/components/auth/FloatingIcons";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden py-10">
      {/* Floating animated icons */}
      <FloatingIcons />

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
          <CardTitle className="text-2xl font-bold">Create a new account</CardTitle>
          <CardDescription>Sign up to start the experience</CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm />
        </CardContent>
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
