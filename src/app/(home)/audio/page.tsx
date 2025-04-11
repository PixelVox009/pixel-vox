"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";

import AudioTools from "@/components/users/audio/AudioTools";
import FeaturedVoices from "@/components/users/audio/FeaturedVoices";
import TextInputArea from "@/components/users/audio/TextInputArea";
import AudioList from "@/components/users/audio/AudioList";

export default function TextToSpeechPage() {
  const [selectedVoice, setSelectedVoice] = useState("speech-02-hd");
  const [selectedVoiceType, setSelectedVoiceType] = useState("Trustworthy Man");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Create Lifelike Speech
      </h1>
      <TextInputArea>
        {/* Voice selector dropdown */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2">
          <ArrowDown size={16} />
          <span>{selectedVoice}</span>
        </div>

        {/* Voice type */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400">T</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {selectedVoiceType}
          </span>
        </div>
      </TextInputArea>

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
