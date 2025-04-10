// app/text-to-speech/page.tsx
"use client";

import AudioTools from "@/components/users/audio/AudioTools";
import FeaturedVoices from "@/components/users/audio/FeaturedVoices";
import TextInputArea from "@/components/users/audio/TextInputArea";
import { useState } from "react";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("speech-02-hd");
  const [selectedVoiceType, setSelectedVoiceType] = useState("Trustworthy Man");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Create Lifelike Speech</h1>
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
      </div>
    </div>
  );
}
