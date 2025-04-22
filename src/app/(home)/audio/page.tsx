// app/text-to-speech/page.tsx
"use client";
import _ from "lodash";
import Image from "next/image";
import { useState } from "react";

import TextInputArea from "@/components/TextInputArea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AudioList from "@/components/users/audio/AudioList";
import { PlayPreviewButton } from "@/components/users/audio/PlayPreviewButton";
import { useGenerateAudio } from "@/hooks/useGenerateAudio";
import { VOICES } from "@/utils/constants";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("fathom");
  const [tokenCost, setTokenCost] = useState<number | null>(null);
  const { generateAudio, handleCheckTokens, isPending, isCheckingTokens } = useGenerateAudio();

  const checkTokens = async () => {
    if (!text.trim()) return;
    const cost = await handleCheckTokens(text);
    setTokenCost(cost);
  };

  const resetTokenCost = () => {
    setTokenCost(null);
  };

  const groupedByVoice = _.groupBy(VOICES, "voice");
  const currentVoice = groupedByVoice[voice][0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Create Lifelike Speech</h1>

      <TextInputArea
        text={text}
        isPending={isPending}
        onTextChange={setText}
        onGenerate={() => generateAudio(text, tokenCost, voice)}
        onCheckTokens={checkTokens}
        onResetTokenCost={resetTokenCost}
        isCheckingTokens={isCheckingTokens}
        tokenCost={tokenCost}
        useToken={true}
      >
        <Select value={voice} onValueChange={(value) => setVoice(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {VOICES.map((voice, index) => (
                <SelectItem value={voice.voice} key={index}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={voice.image}
                      alt={voice.name}
                      width={26}
                      height={26}
                      className="rounded-md object-cover"
                    />
                    <span className="text-sm truncate">{voice.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <PlayPreviewButton url={currentVoice.preview_url} />
        {/* Fathom Breeze Cove Maple Juniper Ember Orbit Vale Glimmer Shade */}
      </TextInputArea>

      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}
