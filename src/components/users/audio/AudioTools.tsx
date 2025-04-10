// components/home/text-to-speech/AudioTools.tsx
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";

export default function AudioTools() {
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">
          Clone Your Voice
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Experience instant voice magic with just 10 seconds of audio input!
        </p>

        <div className="flex flex-col gap-4">
          {/* Original Audio Player */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Original Audio
              </span>
            </div>
            <Button className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Play
                size={16}
                className="text-purple-600 dark:text-purple-400"
              />
            </Button>
          </div>

          {/* Cloned Result Player */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Cloned Result
              </span>
            </div>
            <Button className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Play
                size={16}
                className="text-purple-600 dark:text-purple-400"
              />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button
            variant={"ghost"}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1 ml-auto"
          >
            Try Now
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Button className="w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          Access API
        </Button>
      </div>
    </div>
  );
}
