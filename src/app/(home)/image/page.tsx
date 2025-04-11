"use client";

import TextInputArea from "@/components/users/audio/TextInputArea";

export default function ImageGenerationPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Image Generation
      </h1>
      <TextInputArea />

      <div className="mt-4 flex flex-col gap-4">
        <div className="container mx-auto py-10 dark:text-gray-300">
          <h2 className="text-xl font-bold dark:text-white mb-2">Audio List</h2>
          {/* <DataTable
            columns={columns}
            isLoading={isLoading}
            data={data?.data?.docs || []}
          /> */}
        </div>
      </div>
    </div>
  );
}
