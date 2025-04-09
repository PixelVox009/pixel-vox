import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">My App</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button>Đăng ký</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gray-50 py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6 sm:text-5xl md:text-6xl">Ứng dụng Next.js với MongoDB</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Hệ thống đăng nhập/đăng ký hoàn chỉnh sử dụng các công nghệ hiện đại.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg">Bắt đầu ngay</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Tính năng</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Next.js</h3>
                <p className="text-muted-foreground">
                  Xây dựng trên Next.js với hỗ trợ đầy đủ cho cả frontend và backend.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">MongoDB</h3>
                <p className="text-muted-foreground">
                  Sử dụng MongoDB để lưu trữ dữ liệu người dùng an toàn và hiệu quả.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Shadcn UI</h3>
                <p className="text-muted-foreground">Giao diện đẹp mắt với các component có thể tái sử dụng.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} My App. Đã đăng ký bản quyền.
        </div>
      </footer>
    </div>
  );
}
