// components/home/hero-section.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Tạo nội dung AI
                <br />
                chuyên nghiệp và nhanh chóng
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Chuyển đổi ý tưởng của bạn thành âm thanh, hình ảnh và video chất lượng cao chỉ với vài cú nhấp chuột.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-1.5">
                  Bắt đầu ngay <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative h-full">
              {/* Abstract shape decorations */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <div className="rounded-xl bg-gradient-to-br from-blue-100 via-blue-200 to-purple-100 p-8 shadow-lg dark:from-blue-900 dark:via-blue-800 dark:to-purple-900">
                  <div className="flex flex-col space-y-2">
                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
                      <div className="h-6 w-32 rounded-md bg-blue-100 dark:bg-blue-700"></div>
                    </div>
                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
                      <div className="h-6 w-40 rounded-md bg-blue-100 dark:bg-blue-700"></div>
                    </div>
                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
                      <div className="h-6 w-36 rounded-md bg-blue-100 dark:bg-blue-700"></div>
                    </div>
                    <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800">
                      <div className="h-6 w-28 rounded-md bg-blue-100 dark:bg-blue-700"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <div className="rounded-lg bg-blue-500 p-2 text-white shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-[40%] top-[30%] h-32 w-32 rounded-full bg-blue-500/20 blur-3xl"></div>
              <div className="absolute left-[10%] top-[60%] h-32 w-32 rounded-full bg-purple-500/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
