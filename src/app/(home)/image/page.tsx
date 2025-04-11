"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import TextInputArea from "@/components/TextInputArea";
import { DataTable } from "@/components/DataTable";
import { imageService } from "@/lib/api/image";
import { columns } from "@/components/users/image/columns";

export default function ImageGenerationPage() {
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["image"],
    queryFn: imageService.getImageList,
  });

  const handleGenerate = () => {
    if (!text.trim()) return;

    // mutate(text);
    setIsPending(true);
    setTimeout(() => setIsPending(false), 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Image Generation
      </h1>
      <TextInputArea
        text={text}
        setText={setText}
        isPending={isPending}
        onGenerate={handleGenerate}
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="container mx-auto py-10 dark:text-gray-300">
          <h2 className="text-xl font-bold dark:text-white mb-2">Image List</h2>
          <DataTable
            columns={columns}
            isLoading={isLoading}
            data={data?.data?.docs || []}
          />
        </div>
      </div>
    </div>
  );
}
