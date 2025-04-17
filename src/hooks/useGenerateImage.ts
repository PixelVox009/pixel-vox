import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { imageService } from "@/lib/api/image";
import { fetchImageToTokenRate } from "@/lib/helpers/imageHelpers";
import { translateEnglish } from "@/lib/helpers/translateHelper";
import { useTokenGuard } from "./useTokenGuard";

export function useGenerateImage() {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();
  const { checkAndSubtract } = useTokenGuard();

  const { mutate } = useMutation({
    mutationFn: imageService.generateImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image"] });
      toast.success("Tạo image thành công!");
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi khi tạo image.");
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  const generateImage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsPending(true);

      try {
        const tokenUsage = await fetchImageToTokenRate();
        const allowed = await checkAndSubtract(tokenUsage);
        if (!allowed) {
          setIsPending(false);
          return;
        }

        const title = text.split(" ").slice(0, 8).join(" ").trim();
        const translatedContent = await translateEnglish(text);

        if (!translatedContent) {
          toast.error("Translation failed. Please try again.");
          setIsPending(false);
          return;
        }

        mutate({ title, textContent: translatedContent });
      } catch (error) {
        console.error(error);
        toast.error("Đã xảy ra lỗi khi tạo image.");
        setIsPending(false);
      }
    },
    [checkAndSubtract, mutate]
  );

  return { generateImage, isPending };
}
