// components/text-to-speech/TextInputArea.tsx
import { useState } from "react";
import { Book, ShoppingCart, Sparkles, ArrowDown, Download } from "lucide-react";

interface TextInputAreaProps {
  text: string;
  onTextChange: (text: string) => void;
  selectedVoice: string;
  selectedVoiceType: string;
}

export default function TextInputArea({ text, onTextChange, selectedVoice, selectedVoiceType }: TextInputAreaProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      // Here you would normally handle the response
    }, 2000);
  };

  const templateOptions = [
    { icon: <Book size={18} />, label: "Tell a Story" },
    { icon: <ShoppingCart size={18} />, label: "Create a Commercial" },
    { icon: <Sparkles size={18} />, label: "Build an AI Tutor" },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Text input */}
      <div className="p-4">
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Start typing here to create lifelike speech in multiple languages, voices and emotions with Minimax AI."
          className="w-full h-32 resize-none border-0 focus:ring-0 bg-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
        />
      </div>

      {/* Template options */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-wrap gap-3">
          {templateOptions.map((option, index) => (
            <button
              key={index}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voice selection and generate button */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
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
            <span className="text-gray-700 dark:text-gray-300">{selectedVoiceType}</span>
          </div>
        </div>

        {/* Generate button */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
            <Download size={20} />
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className={`
              px-4 py-2 rounded-md flex items-center gap-2 
              ${
                isGenerating || !text.trim()
                  ? "bg-purple-400 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
            `}
          >
            <Sparkles size={16} />
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
