import { Separator } from "@radix-ui/react-dropdown-menu";
import { ArrowLeftRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AudioList from "./components/AudioList";

function AudioPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className="text-[32px] font-bold">Create Lifelike Speech</h1>
      <div className="p-6 bg-white rounded-xl shadow-md mt-4 flex flex-col gap-4">
        <Textarea
          placeholder="Start typing here to create lifelike speech in multiple languages, voices and emotions with Pixel Vox."
          className="w-full border-transparent md:text-base p-0 h-[36vh] resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
        />
        <div>
          <Separator />
          <div className="flex items-center mt-4">
            <Button
              variant={"outline"}
              className="rounded-xl bg-[#F5F6FA] flex items-center gap-2 px-4 py-2 hover:border-1 transition duration-200 ease-in-out"
            >
              <ArrowLeftRight size={16} />
              <span>Voice Selection</span>
            </Button>
            <Button className="rounded-full bg-[#4B6EFA] text-white flex items-center gap-2 px-4 py-2 hover:bg-[#4B6EFA] transition duration-200 ease-in-out ml-auto">
              <Sparkles size={16} />
              <span>Generate</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-md mt-4 flex flex-col gap-4">
        <AudioList />
      </div>
    </div>
  );
}

export default AudioPage;
