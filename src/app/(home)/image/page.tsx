"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "yet-another-react-lightbox/styles.css";
import axios from "axios";

import TextInputArea from "@/components/TextInputArea";
import { DataTable } from "@/components/DataTable";
import { imageService } from "@/lib/api/image";
import { columns } from "@/components/users/image/columns";

export default function ImageGenerationPage() {
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["image"],
    queryFn: imageService.getImageList,
  });

  // Mutations
  const { mutate } = useMutation({
    mutationFn: imageService.generateImage,
    onSuccess: () => {
      setIsPending(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `Translate this to English: "${text}"`,
            },
          ],
        },
      ],
    };

    setIsPending(true);
    const { data: resData } = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      payload,
      { params: { key: "AIzaSyCVow2f9OcpR_GRse_T5KR3RtyUjP04zB4" } }
    );
    const data = resData;
    const content = data["candidates"][0]["content"]["parts"][0]["text"];
    const title = text.split(" ").slice(0, 8).join(" ").trim();

    mutate({ title, textContent: content });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Image Generation
      </h1>
      <TextInputArea
        text={text}
        onTextChange={setText}
        isPending={isPending}
        onGenerate={handleGenerate}
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="py-10 dark:text-gray-300">
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
