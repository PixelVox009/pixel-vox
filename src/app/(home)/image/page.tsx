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
import { PAGE_SIZE } from "@/utils/constants";

export default function ImageGenerationPage() {
  const [text, setText] = useState("");
  const { generateImage, isPending } = useGenerateImage();
  const [page, setPage] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["image", page],
    queryFn: () =>
      imageService.getImageList({ page: page + 1, limit: PAGE_SIZE }),
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
        useToken={false}
        fixedTokenCost={5}
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="py-10 dark:text-gray-300">
          <h2 className="text-xl font-bold dark:text-white mb-2">Image List</h2>

          <DataTable
            columns={columns}
            isLoading={isFetching}
            items={data?.data?.docs || []}
            totalPages={data?.data?.totalPages}
            pageIndex={page}
            pageSize={PAGE_SIZE}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
