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
        onTextChange={setText}
        selectedVoice={selectedVoice}
        selectedVoiceType={selectedVoiceType}
      />

      {/* Audio Tools and Featured Voices Section */}
      <div className="mt-12">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold dark:text-white">Audio Tools</h2>
          <div>
            <h2 className="text-xl font-bold dark:text-white">Featured Voices</h2>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Explore all &gt;
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row mt-4 gap-8">
          {/* Left - Audio Tools */}
          <div className="md:w-1/2">
            <AudioTools />
          </div>

          {/* Right - Featured Voices */}
          <div className="md:w-1/2">
            <FeaturedVoices onSelectVoice={setSelectedVoice} onSelectVoiceType={setSelectedVoiceType} />
          </div>
        </div>
      </TextInputArea>

      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}
