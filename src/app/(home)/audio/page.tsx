"use client";

import { ArrowDown } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        setText={setText}
        isPending={isPending}
        onGenerate={handleGenerate}
      >
        {/* Voice selector dropdown */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2">
          <ArrowDown size={16} />
          <span>{"speech-02-hd"}</span>
        </div>

        {/* Voice type */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400">T</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {"Trustworthy Man"}
          </span>
        </div>
      </TextInputArea>

      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}
