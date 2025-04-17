// hooks/useGenerateAudio.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { audioService } from "@/lib/api/audio";
import {
  estimateCharsPerMinute,
  fetchMinuteToTokenRate,
} from "@/lib/helpers/audioHelpers";
import { useTokenGuard } from "./useTokenGuard";

export function useGenerateAudio() {
  const [isPending, setIsPending] = useState(false);
  const [isCheckingTokens, setIsCheckingTokens] = useState(false);
  const queryClient = useQueryClient();
  const { checkAndSubtract } = useTokenGuard();

  const { mutate } = useMutation({
    mutationFn: audioService.generateAudio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio"] });
      toast.success("Tạo audio thành công!");
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi khi tạo audio.");
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // Hàm kiểm tra số token cần thiết
  const handleCheckTokens = async (text: string) => {
    if (!text.trim()) return 0;

    setIsCheckingTokens(true);
    try {
      const title = text.split(" ").slice(0, 8).join(" ").trim();
      const tokenRate = await fetchMinuteToTokenRate();
      const charsPerMinute = await estimateCharsPerMinute(title);

      const estimateDuration = Math.ceil(text.length / charsPerMinute);
      const tokenUsage = estimateDuration * tokenRate;

      return tokenUsage;
    } catch (error) {
      console.error("Error checking tokens:", error);
      toast.error("Không thể tính toán chi phí token");
      return 0;
    } finally {
      setIsCheckingTokens(false);
    }
  };

  // Hàm tạo audio
  const generateAudio = useCallback(
    async (text: string, tokenUsage: number | null = null, voice: string) => {
      if (!text.trim()) return;

      setIsPending(true);

      try {
        let calculatedTokenUsage = tokenUsage;

        // Nếu chưa có tokenUsage thì tính toán
        if (calculatedTokenUsage === null) {
          calculatedTokenUsage = await handleCheckTokens(text);
        }

        // Sử dụng token guard để kiểm tra và trừ tokens
        const allowed = await checkAndSubtract(calculatedTokenUsage);
        if (!allowed) {
          setIsPending(false);
          return;
        }

        mutate({ textContent: text, voice });
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi tạo audio.");
        setIsPending(false);
      }
    },
    [checkAndSubtract, mutate]
  );

  return {
    generateAudio,
    handleCheckTokens,
    isPending,
    isCheckingTokens,
  };
}
