// components/TextInputArea.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTokenEstimation } from "@/hooks/useTokenEstimation";
import { useTokenStore } from "@/lib/store";
import { Download, Sparkles } from "lucide-react";

type TextInputAreaProps = {
  children?: React.ReactNode;
  text: string;
  isPending: boolean;
  onTextChange: (value: string) => void;
  onGenerate: () => void;
  useToken?: boolean; // Dùng token estimation
  fixedTokenCost?: number; // Nếu không dùng token estimation thì hiển thị số token cố định
};

export default function TextInputArea({
  children,
  text,
  isPending,
  onTextChange,
  onGenerate,
  useToken = true,
  fixedTokenCost = 0,
}: TextInputAreaProps) {
  const { estimatedTokens } = useTokenEstimation(text);
  const tokenBalance = useTokenStore((state) => state.tokenBalance);

  const tokenCost = useToken ? estimatedTokens : fixedTokenCost;
  const isInsufficientTokens =
    tokenCost !== null && tokenBalance !== null && tokenCost > tokenBalance;

  const missingTokens = isInsufficientTokens ? tokenCost - tokenBalance : 0;

  return (
    <div className="w-full bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
      <Textarea
        value={text}
        placeholder="Start typing here to generate content..."
        className="w-full border-transparent md:text-base p-0 h-[36vh] resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
        onChange={(e) => onTextChange(e.target.value)}
      />

      <Separator />

      <div className="border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">{children}</div>
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Download size={20} />
          </Button>

          <Button
            onClick={onGenerate}
            disabled={isPending || !text.trim() || isInsufficientTokens}
            className={`
              px-4 py-2 rounded-md flex items-center gap-2 
              ${
                isPending || !text.trim() || isInsufficientTokens
                  ? "bg-purple-400 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
            `}
          >
            <Sparkles size={16} />
            {isPending
              ? "Generating..."
              : isInsufficientTokens
              ? `Không đủ credits (${missingTokens} credits)`
              : text.trim()
              ? `${tokenCost} credits`
              : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
