"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

import TextInputArea from "@/components/TextInputArea";
import AudioList from "@/components/users/audio/AudioList";
import { audioService } from "@/lib/api/audio";
import { userService } from "@/lib/api/user";
import { genai } from "@/utils/genai";
import { api } from "@/utils/axios";
import { useTokenStore } from "@/lib/store";

const getSettings = async () => {
  const { data: res } = await api.get("/settings", {
    params: {
      key: "minuteToTokenRate",
    },
  });
  return res.data;
};

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const tokenStore = useTokenStore();

  const queryClient = useQueryClient();

  // Mutations
  const { mutate } = useMutation({
    mutationFn: audioService.generateAudio,
    onSuccess: () => {
      setIsPending(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["audio"] });
    },
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsPending(true);
    const title = text.split(" ").slice(0, 8).join(" ").trim();
    const setting = await getSettings();
    const tokenRate = +setting[0].value;

    // tính thời lượng
    const resData = await genai.genContent(
      `Dựa trên tiêu đề sau: '${title}', xác định ngôn ngữ của nó và ước tính số ký tự có thể đọc được trong một phút theo tốc độ xử lý/ngôn ngữ tự nhiên của chính ChatGPT. Chỉ trả về một con số (ký tự mỗi phút), không thêm bất kỳ văn bản nào khác.`
    );

    const estimateDuration = Math.ceil(text.length / parseInt(resData ?? "0"));
    const tokenUsage = estimateDuration * +tokenRate;

    if ((tokenStore.tokenBalance ?? 0) >= tokenRate) {
      userService.useToken(tokenUsage);
      tokenStore.subtractTokens(tokenUsage);
      mutate(text);
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
        Create Lifelike Speech
      </h1>
      <TextInputArea
        text={text}
        onTextChange={setText}
        isPending={isPending}
        onGenerate={handleGenerate}
      >
        {/* Voice selection and generate button */}
      </TextInputArea>

      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}
