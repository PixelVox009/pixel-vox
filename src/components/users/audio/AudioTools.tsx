// components/home/text-to-speech/AudioTools.tsx
import { Play, ArrowRight } from "lucide-react";

export default function AudioTools() {
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="text-lg font-semibold mb-2 dark:text-white">Clone Your Voice</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Experience instant voice magic with just 10 seconds of audio input!
        </p>

        <div className="flex flex-col gap-4">
          {/* Original Audio Player */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Original Audio</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Play size={16} className="text-purple-600 dark:text-purple-400" />
            </button>
          </div>

          {/* Arrow Indicator */}
          <div className="w-full flex justify-center">
            <div className="w-16 h-8 relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-gray-300 dark:bg-gray-700"></div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rotate-90">
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Cloned Result Player */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">Cloned Result</span>
            </div>
            <button className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Play size={16} className="text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Try Now
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full py-2 px-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          Access API
        </button>
      </div>
    </div>
  );
}
