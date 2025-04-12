// components/text-to-speech/TextInputArea.tsx
import { Sparkles, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type TextInputAreaProps = {
  children?: React.ReactNode;
  text: string;
  isPending: boolean;
  setText: (value: string) => void;
  onGenerate: () => void;
};

export default function TextInputArea({
  children,
  text,
  isPending,
  setText,
  onGenerate,
}: TextInputAreaProps) {
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
            onClick={onGenerate}
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
