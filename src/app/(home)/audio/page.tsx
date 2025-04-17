// app/text-to-speech/page.tsx
"use client";
import TextInputArea from "@/components/TextInputArea";
import AudioList from "@/components/users/audio/AudioList";
import { useGenerateAudio } from "@/hooks/useGenerateAudio";
import { useState } from "react";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [tokenCost, setTokenCost] = useState<number | null>(null);
  const { generateAudio, handleCheckTokens, isPending, isCheckingTokens } = useGenerateAudio();

  const checkTokens = async () => {
    if (!text.trim()) return;
    const cost = await handleCheckTokens(text);
    setTokenCost(cost);
  };

  const onGenerate = () => {
    generateAudio(text, tokenCost);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Create Lifelike Speech</h1>

      <TextInputArea
        text={text}
        isPending={isPending}
        onTextChange={setText}
        onGenerate={onGenerate}
        onCheckTokens={checkTokens}
        isCheckingTokens={isCheckingTokens}
        tokenCost={tokenCost}
        useToken={true}
      />

      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}
