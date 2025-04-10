// components/home/text-to-speech/FeaturedVoices.tsx
import Image from "next/image";

interface VoiceProps {
  id: string;
  name: string;
  image: string;
  tags: string[];
  copyFeature?: boolean;
}

interface FeaturedVoicesProps {
  onSelectVoice: (voice: string) => void;
  onSelectVoiceType: (voiceType: string) => void;
}

export default function FeaturedVoices({
  onSelectVoice,
  onSelectVoiceType,
}: FeaturedVoicesProps) {
  // Sample featured voices
  const voices: VoiceProps[] = [
    {
      id: "radiant-girl",
      name: "Radiant Girl",
      image: "/image.webp",
      tags: ["English", "Female", "Young Adult", "Lively", "EN-US (General)"],
    },
    {
      id: "expressive-narrator",
      name: "Expressive Narrator",
      image: "/voices/expressive-narrator.jpg",
      tags: ["English", "Male", "Adult", "Audiobook", "EN-British"],
    },
    {
      id: "magnetic-voiced-male",
      name: "Magnetic-voiced Male",
      image: "/voices/magnetic-male.jpg",
      tags: ["English", "Male", "Adult", "Ads", "EN-US (General)"],
    },
  ];

  const handleVoiceSelect = (voice: VoiceProps) => {
    onSelectVoice(voice.id);
    onSelectVoiceType(voice.name);
  };

  return (
    <div className="w-full space-y-4">
      {voices.map((voice) => (
        <div
          key={voice.id}
          className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 flex items-center gap-3 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
          onClick={() => handleVoiceSelect(voice)}
        >
          {/* Voice Avatar */}
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800">
            <Image
              src={voice.image}
              alt={voice.name}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback for missing images
                const target = e.target as HTMLElement;
                target.style.backgroundColor = "#8B5CF6";
                target.textContent = voice.name.charAt(0);
                target.style.display = "flex";
                target.style.justifyContent = "center";
                target.style.alignItems = "center";
                target.style.color = "white";
                target.style.fontSize = "1.5rem";
              }}
            />
            {voice.copyFeature && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs p-0.5 rounded-bl">
                Copy
              </div>
            )}
          </div>

          {/* Voice Details */}
          <div className="flex-1">
            <h3 className="font-medium dark:text-white flex items-center gap-1">
              {voice.name}
              {voice.copyFeature && (
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {voice.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
