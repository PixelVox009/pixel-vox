"use client"
import { useState } from "react";
import { useGenerateAudio } from "@/hooks/useGenerateAudio";
import TextInputArea from "@/components/TextInputArea";
import AudioList from "@/components/users/audio/AudioList";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const { generateAudio, isPending } = useGenerateAudio();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Create Lifelike Speech
      </h1>
      <TextInputArea
        text={text}
        onTextChange={setText}
        isPending={isPending}
        onGenerate={() => generateAudio(text)}
      >
        {/* Voice selection and generate button */}
      </TextInputArea>

      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}