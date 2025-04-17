// lib/hooks/useTokenGuard.ts
import { toast } from "react-toastify";
import { useTokenStore } from "@/lib/store";

export function useTokenGuard() {
  const tokenStore = useTokenStore();

  const checkAndSubtract = async (usage: number): Promise<boolean> => {
    const balance = tokenStore.tokenBalance ?? 0;
    if (balance < usage) {
      toast.error("Điểm của bạn không đủ. Vui lòng nạp thêm để tiếp tục.");
      return false;
    }
    await tokenStore.subtractTokens(usage);
    return true;
  };

  return { checkAndSubtract };
}
