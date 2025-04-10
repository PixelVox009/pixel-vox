// app/text-to-speech/page.tsx
"use client";

import { useState } from "react";
import AudioTools from "@/components/users/audio/AudioTools";
import FeaturedVoices from "@/components/users/audio/FeaturedVoices";
import TextInputArea from "@/components/users/audio/TextInputArea";
import AudioList from "./components/AudioList";

export default function TextToSpeechPage() {
  const [selectedVoice, setSelectedVoice] = useState("speech-02-hd");
  const [selectedVoiceType, setSelectedVoiceType] = useState("Trustworthy Man");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Create Lifelike Speech
      </h1>
      <TextInputArea
        selectedVoice={selectedVoice}
        selectedVoiceType={selectedVoiceType}
      />

      {/* Audio Tools and Featured Voices Section */}
      <div className="mt-12">
        <div className="flex flex-col md:flex-row mt-4 gap-8">
          {/* Left - Audio Tools */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-bold dark:text-white mb-2">
              Audio Tools
            </h2>
            <AudioTools />
          </div>

          {/* Right - Featured Voices */}
          <div className="md:w-1/2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold dark:text-white">
                Featured Voices
              </h2>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Explore all &gt;
              </a>
            </div>
            <FeaturedVoices
              onSelectVoice={setSelectedVoice}
              onSelectVoiceType={setSelectedVoiceType}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}
