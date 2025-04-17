import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

import { audioService } from "@/lib/api/audio";
import {
  estimateCharsPerMinute,
  fetchMinuteToTokenRate,
} from "@/lib/helpers/audioHelpers";
import { useTokenStore } from "@/lib/store";

export function useGenerateAudio() {
  const [isPending, setIsPending] = useState(false);
  const tokenStore = useTokenStore();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: audioService.generateAudio,
    onSuccess: () => {
      setIsPending(false);
      queryClient.invalidateQueries({ queryKey: ["audio"] });
      toast.success("Tạo audio thành công!");
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi khi tạo audio.");
      setIsPending(false);
    }
  });

  const generateAudio = async (text: string) => {
    if (!text.trim()) return;

    setIsPending(true);

    try {
      const title = text.split(" ").slice(0, 8).join(" ").trim();
      const tokenRate = await fetchMinuteToTokenRate();
      const charsPerMinute = await estimateCharsPerMinute(title);

      const estimateDuration = Math.ceil(text.length / charsPerMinute);
      const tokenUsage = estimateDuration * tokenRate;

      if ((tokenStore.tokenBalance ?? 0) >= tokenUsage) {
        tokenStore.subtractTokens(tokenUsage);
        mutate(text);
      } else {
        toast.error(
          "Điểm của bạn đang ko đủ. Vui lòng nạp thêm điểm để tiếp tục sử dụng."
        );
        setIsPending(false);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tạo audio.");
      setIsPending(false);
    }
  };

  return { generateAudio, isPending };
}