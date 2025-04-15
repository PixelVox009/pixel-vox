"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "yet-another-react-lightbox/styles.css";
import { toast } from "react-toastify";

import TextInputArea from "@/components/TextInputArea";
import { DataTable } from "@/components/DataTable";
import { imageService } from "@/lib/api/image";
import { columns } from "@/components/users/image/columns";
import { genai } from "@/utils/genai";
import { api } from "@/utils/axios";
import { userService } from "@/lib/api/user";
import { useTokenStore } from "@/lib/store";

const getSettings = async () => {
  const { data: res } = await api.get("/settings", {
    params: {
      key: "imageToTokenRate",
    },
  });
  return res.data;
};

export default function ImageGenerationPage() {
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const tokenStore = useTokenStore();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["image"],
    queryFn: imageService.getImageList,
  });

  // Mutations
  const { mutate } = useMutation({
    mutationFn: imageService.generateImage,
    onSuccess: () => {
      setIsPending(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    const setting = await getSettings();
    const tokenRate = +setting[0].value;
    const tokenUsage = +tokenRate;

    setIsPending(true);

    if ((tokenStore.tokenBalance ?? 0) >= tokenRate) {
      userService.useToken(tokenUsage);
      tokenStore.subtractTokens(tokenUsage);

      const title = text.split(" ").slice(0, 8).join(" ").trim();

      const resData = await genai.genContent(
        `Translate this to English: "${text}"`
      );

      mutate({ title, textContent: resData || "" });
    } else {
      toast.error(
        "Điểm của bạn đang ko đủ. Vui lòng nạp thêm điểm để tiếp tục sử dụng."
      );
      setIsPending(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Image Generation
      </h1>
      <TextInputArea
        text={text}
        onTextChange={setText}
        isPending={isPending}
        onGenerate={handleGenerate}
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="py-10 dark:text-gray-300">
          <h2 className="text-xl font-bold dark:text-white mb-2">Image List</h2>
          <DataTable
            columns={columns}
            isLoading={isLoading}
            data={data?.data?.docs || []}
          />
        </div>
      </div>
    </div>
  );
}
