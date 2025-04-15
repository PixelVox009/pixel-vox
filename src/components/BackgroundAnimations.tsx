import { Music, Sparkles, Video } from "lucide-react";

export function BackgroundAnimations() {
  return (
    <div className="absolute h-full w-full">
      <div className="absolute top-[15%] left-[10%] text-blue-500 animate-bounce" style={{ animationDuration: "3s" }}>
        <Music className="h-8 w-8 opacity-20" />
      </div>
      <div
        className="absolute top-[30%] right-[15%] text-purple-500 animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>
      <div
        className="absolute bottom-[20%] left-[20%] text-pink-500 animate-bounce"
        style={{ animationDuration: "3.5s" }}
      >
        <Video className="h-9 w-9 opacity-20" />
      </div>
      <div
        className="absolute bottom-[25%] right-[10%] text-yellow-500 animate-pulse"
        style={{ animationDuration: "2.5s" }}
      >
        <Sparkles className="h-7 w-7 opacity-20" />
      </div>
    </div>
  );
}
