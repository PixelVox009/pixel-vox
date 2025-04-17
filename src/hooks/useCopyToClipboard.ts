import { useState } from "react";
import copy from "clipboard-copy";

export const useCopyToClipboard = (resetDelay = 2000) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = (text: string) => {
        copy(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
    };

    return { copied, handleCopy };
};