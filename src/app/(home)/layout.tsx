import Header from "@/components/users/layout/header";
import Sidebar from "@/components/users/layout/side-bar";
import { ReactNode } from "react";


interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-white dark:bg-gray-950">
          {/* Sidebar chung cho toàn bộ website */}
          <Sidebar />

          {/* Phần nội dung chính bao gồm header và main content */}
          <div className="flex-1 flex flex-col">
            {/* Header chung */}
            <Header />

            {/* Main content area */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
