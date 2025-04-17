import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import { audioService } from "@/lib/api/audio";
import {
  estimateCharsPerMinute,
  fetchMinuteToTokenRate,
} from "@/lib/helpers/audioHelpers";
import { useTokenGuard } from "./useTokenGuard";

export function useGenerateAudio() {
  const [isPending, setIsPending] = useState(false);
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

  const generateAudio = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsPending(true);

      try {
        const title = text.split(" ").slice(0, 8).join(" ").trim();
        const tokenRate = await fetchMinuteToTokenRate();
        const charsPerMinute = await estimateCharsPerMinute(title);
        const estimateDuration = Math.ceil(text.length / charsPerMinute);
        const tokenUsage = estimateDuration * tokenRate;

        const allowed = await checkAndSubtract(tokenUsage);
        if (!allowed) {
          setIsPending(false);
          return;
        }

        mutate(text);
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi tạo audio.");
        setIsPending(false);
      }
    },
    [checkAndSubtract, mutate]
  );

  return { generateAudio, isPending };
}
