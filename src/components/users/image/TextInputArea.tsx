// components/text-to-speech/TextInputArea.tsx
import { useState } from "react";
import { Book, ShoppingCart, Sparkles, Download } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { audioService } from "@/lib/api/audio";

interface TextInputAreaProps {
  children?: React.ReactNode;
}

export default function TextInputArea({ children }: TextInputAreaProps) {
  // const [isGenerating, setIsGenerating] = useState(false);
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

  const templateOptions = [
    { icon: <Book size={18} />, label: "Tell a Story" },
    { icon: <ShoppingCart size={18} />, label: "Create a Commercial" },
    { icon: <Sparkles size={18} />, label: "Build an AI Tutor" },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
      {/* Text input */}

      <Textarea
        value={text}
        placeholder="Start typing here to create lifelike speech in multiple languages, voices and emotions with Pixel Vox."
        className="w-full border-transparent md:text-base p-0 h-[36vh] resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
        onChange={(e) => setText(e.target.value)}
      />

      <Separator />
      {/* Template options */}
      <div className="border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-wrap gap-3">
          {templateOptions.map((option, index) => (
            <Button
              key={index}
              variant={"ghost"}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {option.icon}
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />
      {/* Voice selection and generate button */}
      <div className=" border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">{children}</div>

        {/* Generate button */}
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Download size={20} />
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isPending || !text.trim()}
            className={`
              px-4 py-2 rounded-md flex items-center gap-2 
              ${
                isPending || !text.trim()
                  ? "bg-purple-400 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
            `}
          >
            <Sparkles size={16} />
            {isPending ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
