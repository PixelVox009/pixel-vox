// components/providers.tsx
"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default Providers;
