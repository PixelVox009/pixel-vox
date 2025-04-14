import { BackgroundAnimations } from "@/components/BackgroundAnimations";
import { LoginForm } from "@/components/LoginForm";
import PixelVoxLogo from "@/components/logo";
import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <BackgroundAnimations />

      {/* Header with logo */}
      <div className="absolute top-6 left-0 w-full flex justify-center">
        <Link href="/">
          <PixelVoxLogo width={180} height={70} />
        </Link>
      </div>

      <Suspense fallback={<div className="text-center">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
