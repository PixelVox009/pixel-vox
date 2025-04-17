// components/TextInputArea.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTokenStore } from "@/lib/store";
import { Calculator, Download, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type TextInputAreaProps = {
  children?: React.ReactNode;
  text: string;
  isPending: boolean;
  isCheckingTokens?: boolean;
  tokenCost?: number | null;
  onTextChange: (value: string) => void;
  onGenerate: () => void;
  onCheckTokens?: () => void;
  onResetTokenCost?: () => void;
  useToken?: boolean;
  fixedTokenCost?: number;
};

export default function TextInputArea({
  text,
  isPending,
  isCheckingTokens = false,
  tokenCost,
  onTextChange,
  onGenerate,
  onCheckTokens,
  onResetTokenCost,
  useToken = true,
  fixedTokenCost = 0,
}: TextInputAreaProps) {
  const tokenBalance = useTokenStore((state) => state.tokenBalance);
  const [lastCheckedText, setLastCheckedText] = useState<string>("");
  useEffect(() => {
    if (tokenCost !== null && !isCheckingTokens) {
      setLastCheckedText(text);
    }
  }, [tokenCost, isCheckingTokens, text]);
  const textChanged = text !== lastCheckedText && lastCheckedText !== "";
  useEffect(() => {
    if (textChanged && tokenCost !== null && onResetTokenCost) {
      onResetTokenCost();
    }
  }, [text, textChanged, tokenCost, onResetTokenCost]);
  const effectiveTokenCost = useToken ? tokenCost ?? fixedTokenCost : fixedTokenCost;
  const isInsufficientTokens =
    effectiveTokenCost !== null && tokenBalance !== null && effectiveTokenCost > tokenBalance;
  const missingTokens = isInsufficientTokens ? effectiveTokenCost - tokenBalance : 0;
  const isGenerateDisabled =
    isPending || !text.trim() || isInsufficientTokens || (useToken && (textChanged || tokenCost === null));
  return (
    <div className="w-full bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
      <Textarea
        value={text}
        placeholder="Start typing here to generate content..."
        className="w-full border-transparent md:text-base p-0 h-[36vh] resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
        onChange={(e) => onTextChange(e.target.value)}
      />
      <Separator />
      <div className="border-gray-200 dark:border-gray-800 p-4 flex justify-end items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
          >
            <Download size={20} />
          </Button>
          <div>
            {useToken && (
              <Button
                variant="outline"
                onClick={onCheckTokens}
                disabled={isCheckingTokens || !text.trim()}
                className="flex items-center gap-2"
              >
                <Calculator size={16} />
                {isCheckingTokens ? "Considering..." : textChanged ? "Calculate costs" : "Calculate costs"}
              </Button>
            )}
          </div>
          <Button
            onClick={async () => {
              await onGenerate();
              onTextChange("");
            }}
            disabled={isGenerateDisabled}
            className={`
              px-4 py-2 rounded-md flex items-center gap-2 
              ${
                isGenerateDisabled
                  ? "bg-purple-400 text-white cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }
            `}
          >
            <Sparkles size={16} />
            {isPending
              ? "Generating..."
              : isInsufficientTokens
              ? `Not enough credits (${missingTokens} credits)`
              : useToken && (tokenCost === null || textChanged)
              ? "Generate"
              : `${effectiveTokenCost} credits`}
          </Button>
        </div>
      </div>
    </div>
  );
}
