import { useState } from "react";
import { ArrowDownToLine, Loader } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { saveFile } from "@/utils/saveFile";

export function DownloadButton({
  audio,
  isAudioReady,
}: {
  audio: Audio;
  isAudioReady: boolean;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading || !audio.audioLink) return;

    setIsDownloading(true);
    try {
      await saveFile(audio.audioLink, audio.title);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            disabled={isDownloading || !isAudioReady}
            className="h-8 w-8 p-0 hover:bg-muted"
            onClick={handleDownload}
          >
            {isDownloading ? (
              <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tải xuống</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
