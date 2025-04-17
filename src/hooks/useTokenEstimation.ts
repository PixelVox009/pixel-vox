// hooks/useTokenEstimation.ts
import { estimateCharsPerMinute, fetchMinuteToTokenRate } from "@/lib/helpers/audioHelpers";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function useTokenEstimation(text: string) {
    const [estimatedTokens, setEstimatedTokens] = useState<number | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [debouncedText] = useDebounce(text, 500); // Đợi 500ms sau khi người dùng ngừng gõ

    useEffect(() => {
        async function calculateTokens() {
            if (!debouncedText.trim()) {
                setEstimatedTokens(0);
                return;
            }

            setIsCalculating(true);
            try {
                const title = debouncedText.split(" ").slice(0, 8).join(" ").trim();
                const tokenRate = await fetchMinuteToTokenRate();
                const charsPerMinute = await estimateCharsPerMinute(title);
                const estimateDuration = Math.ceil(debouncedText.length / charsPerMinute);
                const tokenUsage = estimateDuration * tokenRate;

                setEstimatedTokens(tokenUsage);
            } catch (error) {
                console.error("Lỗi khi tính toán token:", error);
                setEstimatedTokens(null);
            } finally {
                setIsCalculating(false);
            }
        }

        calculateTokens();
    }, [debouncedText]);

    return { estimatedTokens, isCalculating };
}