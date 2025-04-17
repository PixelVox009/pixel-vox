// app/text-to-speech/page.tsx
"use client";
import { useState } from "react";
import _ from "lodash";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGenerateAudio } from "@/hooks/useGenerateAudio";
import TextInputArea from "@/components/TextInputArea";
import AudioList from "@/components/users/audio/AudioList";
import { PlayPreviewButton } from "@/components/users/audio/PlayPreviewButton";

const VOICES = [
  {
    voice: "fathom",
    name: "Arbor",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/fathom.en.048343f4.m4a",
    description: "Easygoing and versatile",
    bloop_color: "808080",
    image: "/images/image.webp",
  },
  {
    voice: "breeze",
    name: "Breeze",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/breeze.en.5fc1dadf.m4a",
    description: "Animated and earnest",
    bloop_color: "808080",
    image: "/images/image2.webp",
  },
  {
    voice: "cove",
    name: "Cove",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/cove.en.91bb1aab.m4a",
    description: "Composed and direct",
    bloop_color: "808080",
    image: "/images/image3.webp",
  },
  {
    voice: "maple",
    name: "Maple",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/maple.en.abff11d0.m4a",
    description: "Cheerful and candid",
    bloop_color: "808080",
    image: "/images/image.webp",
  },
  {
    voice: "juniper",
    name: "Juniper",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/juniper.en.23d92c7e.m4a",
    description: "Open and upbeat",
    bloop_color: "808080",
    image: "/images/image2.webp",
  },
  {
    voice: "ember",
    name: "Ember",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/ember.en.940365d1.m4a",
    description: "Confident and optimistic",
    bloop_color: "808080",
    image: "/images/image3.webp",
  },
  {
    voice: "orbit",
    name: "Spruce",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/orbit.en.be588b89.m4a",
    description: "Calm and affirming",
    bloop_color: "808080",
    image: "/images/image.webp",
  },
  {
    voice: "vale",
    name: "Vale",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/vale.en.bd658fb4.m4a",
    description: "Bright and inquisitive",
    bloop_color: "808080",
    image: "/images/image2.webp",
  },
  {
    voice: "glimmer",
    name: "Sol",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/glimmer.en.e8a6d567.m4a",
    description: "Savvy and relaxed",
    bloop_color: "808080",
    image: "/images/image3.webp",
  },
  {
    voice: "shade",
    name: "Monday",
    gain_db: null,
    preview_url:
      "https://persistent.oaistatic.com/voice/previews/shade.en.d4a11b09.m4a",
    description: "Whatever",
    bloop_color: "808080",
    image: "/images/image.webp",
  },
];

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("fathom");
  const [tokenCost, setTokenCost] = useState<number | null>(null);
  const { generateAudio, handleCheckTokens, isPending, isCheckingTokens } =
    useGenerateAudio();

  const checkTokens = async () => {
    if (!text.trim()) return;
    const cost = await handleCheckTokens(text);
    setTokenCost(cost);
  };

  const groupedByVoice = _.groupBy(VOICES, "voice");
  const currentVoice = groupedByVoice[voice][0];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Create Lifelike Speech
      </h1>

      <TextInputArea
        text={text}
        isPending={isPending}
        onTextChange={setText}
        onGenerate={() => generateAudio(text, tokenCost, voice)}
        onCheckTokens={checkTokens}
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
