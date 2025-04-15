"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import TextInputArea from "@/components/TextInputArea";
import AudioList from "@/components/users/audio/AudioList";
import { audioService } from "@/lib/api/audio";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  // Mutations
  const { isPending, mutate } = useMutation({
    mutationFn: audioService.generateAudio,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["audio"] });
    },
  });

  const handleGenerate = () => {
    if (!text.trim()) return;

    mutate(text);
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
