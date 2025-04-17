// app/image-generation/page.tsx
"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "yet-another-react-lightbox/styles.css";

import TextInputArea from "@/components/TextInputArea";
import { DataTable } from "@/components/DataTable";
import { imageService } from "@/lib/api/image";
import { columns } from "@/components/users/image/columns";
import { useGenerateImage } from "@/hooks/useGenerateImage";

export default function ImageGenerationPage() {
  const [text, setText] = useState("");
  const { generateImage, isPending } = useGenerateImage();

  const { data, isFetching } = useQuery({
    queryKey: ["image"],
    queryFn: imageService.getImageList,
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Image Generation
      </h1>

      <TextInputArea
        text={text}
        onTextChange={setText}
        isPending={isPending}
        onGenerate={() => generateImage(text)}
        useToken={false} // ✅ Không dùng estimation
        fixedTokenCost={5} // ✅ Ảnh mặc định 5 credits
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="py-10 dark:text-gray-300">
          <h2 className="text-xl font-bold dark:text-white mb-2">Image List</h2>
          <DataTable
            columns={columns}
            isLoading={isFetching}
            data={data?.data?.docs || []}
          />
        </div>
      </div>
    </div>
  );
}
