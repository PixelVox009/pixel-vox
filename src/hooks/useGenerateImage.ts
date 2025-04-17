// hooks/useGenerateImage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

import { useTokenStore } from "@/lib/store";
import { imageService } from "@/lib/api/image";
import { translateEnglish } from "@/lib/helpers/translateHelper";
import { fetchImageToTokenRate } from "@/lib/helpers/imageHelpers";

export function useGenerateImage() {
  const [isPending, setIsPending] = useState(false);
  const tokenStore = useTokenStore();

  const queryClient = useQueryClient();

  // Mutations
  const { mutate } = useMutation({
    mutationFn: imageService.generateImage,
    onSuccess: () => {
      setIsPending(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });

  const generateImage = async (text: string) => {
    if (!text.trim()) return;
    setIsPending(true);

    try {
      const tokenUsage = await fetchImageToTokenRate();

      if ((tokenStore.tokenBalance ?? 0) >= tokenUsage) {
        tokenStore.subtractTokens(tokenUsage);

        const title = text.split(" ").slice(0, 8).join(" ").trim();
        const translatedContent = await translateEnglish(text);

        if (translatedContent) {
          mutate({ title, textContent: translatedContent });
        } else {
          toast.error("Translation failed. Please try again.");
          setIsPending(false);
        }
      } else {
        toast.error(
          "Điểm của bạn đang ko đủ. Vui lòng nạp thêm điểm để tiếp tục sử dụng."
        );
        setIsPending(false);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tạo image.");
      setIsPending(false);
    }
  };

  return { generateImage, isPending };
}
