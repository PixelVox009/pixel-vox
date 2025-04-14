// components/home/hero-section.tsx
import PixelVoxLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIc, LogIn, Music, Sparkles, Video } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-400/10 blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Login button at top left */}
      <div className="absolute top-0 left-0 w-full py-4 px-6 z-20">
        <div>
          <div className="flex justify-between items-center">
            {/* Logo bên trái */}
            <div className="flex-shrink-0">
              <PixelVoxLogo width={150} height={60} />
            </div>

            {/* Login button bên phải */}
            <div>
              <Link href="/login">
                <Button
                  size="sm"
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-400/70 to-purple-500/70 text-white border-0 hover:from-pink-500/80 hover:to-purple-600/80 hover:shadow-md transition-all px-4 py-2 p-6"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-[15px]">Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left side - Text content */}
          <div className="flex flex-col justify-center items-center lg:items-center space-y-8 text-center z-10">
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                <Sparkles className="h-3.5 w-3.5 mr-2" /> AI Content Creation Platform
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl leading-tight">
                Tạo nội dung AI
                <br />
                chuyên nghiệp và nhanh chóng
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[600px] mx-auto">
                Chuyển đổi ý tưởng của bạn thành âm thanh, hình ảnh và video chất lượng cao chỉ với vài cú nhấp chuột.
              </p>
            </div>

            {/* Feature icons */}
            <div className="flex justify-center gap-8 my-6">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
                  <Music className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <span className="text-sm font-medium">Âm thanh</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mb-2">
                  <ImageIc  className="h-6 w-6 text-purple-600 dark:text-purple-300"/>
                </div>
                <span className="text-sm font-medium">Hình ảnh</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900 mb-2">
                  <Video className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                </div>
                <span className="text-sm font-medium">Video</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-1.5 px-8 py-6 text-base">
                  Bắt đầu ngay <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="px-8 py-6 text-base">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 text-sm text-muted-foreground">
              <p className="mb-2">Đã được tin dùng bởi hơn 10,000+ người dùng</p>
              <div className="flex justify-center space-x-4 items-center">
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          </div>

          {/* Right side - Interactive illustration */}
          <div className="relative flex justify-center items-center z-10">
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-purple-100 p-1 shadow-lg dark:from-blue-900 dark:via-blue-800 dark:to-purple-900 transition-all hover:shadow-xl duration-300">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="h-2.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-2.5 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>

                  <div className="flex space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center animate-pulse">
                      <Music className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div
                      className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <ImageIc className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div
                      className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center animate-pulse"
                      style={{ animationDelay: "1s" }}
                    >
                      <Video className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    </div>
                  </div>

                  <div className="relative h-40 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary animate-bounce" />
                    </div>
                    <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-2.5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <Button size="icon" className="h-8 w-8">
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 h-12 w-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce shadow-lg z-20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div
              className="absolute -bottom-4 -left-4 h-8 w-8 bg-pink-400 rounded-full flex items-center justify-center animate-pulse shadow-lg z-20"
              style={{ animationDelay: "1.5s" }}
            >
              <Music className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full pl-2 pr-4 py-2 flex items-center space-x-2 shadow-lg animate-bounce z-20"
        style={{ animationDuration: "3s" }}
      >
        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
        <span className="text-sm font-medium">Công nghệ mới nhất - Cập nhật 2025</span>
      </div>
    </section>
  );
}

export default HeroSection;
