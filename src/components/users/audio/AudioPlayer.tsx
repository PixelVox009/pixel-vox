"use client";

interface AudioPlayerProps {
  src: string;
  title: string;
  isReady: boolean;
}

/**
 * Component hiển thị trình phát audio với giao diện tối giản và căn giữa
 */
export function AudioPlayer({ src, title, isReady }: AudioPlayerProps) {
  if (!isReady) {
    return <div className="flex items-center justify-center h-8 text-sm text-muted-foreground">Audio is not ready</div>;
  }

  return (
    <audio controls className="w-[270px] h-9" controlsList="nodownload" preload="metadata" title={title}>
      <source src={src} type="audio/mpeg" />
      Your browser does not support audio playback.
    </audio>
  );
}

export default AudioPlayer;
