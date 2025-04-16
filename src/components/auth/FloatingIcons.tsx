import { Music, Image as ImageIcon, Video, Sparkles } from "lucide-react";

export const FloatingIcons = () => {
  return (
    <div className="absolute h-full w-full">
      <div className="absolute top-[20%] left-[15%] text-blue-500 animate-float" style={{ animationDuration: "6s" }}>
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <Music className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
      </div>
      <div
        className="absolute top-[25%] right-[20%] text-purple-500 animate-float"
        style={{ animationDuration: "8s", animationDelay: "1s" }}
      >
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
          <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-300" />
        </div>
      </div>
      <div
        className="absolute bottom-[30%] left-[25%] text-pink-500 animate-float"
        style={{ animationDuration: "7s", animationDelay: "2s" }}
      >
        <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30">
          <Video className="h-6 w-6 text-pink-600 dark:text-pink-300" />
        </div>
      </div>
      <div
        className="absolute bottom-[20%] right-[15%] text-yellow-500 animate-float"
        style={{ animationDuration: "9s", animationDelay: "3s" }}
      >
        <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <Sparkles className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
        </div>
      </div>
    </div>
  );
};
