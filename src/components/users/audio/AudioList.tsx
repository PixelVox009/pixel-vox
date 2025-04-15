import React from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { audioService } from "@/lib/api/audio";

function AudioList() {
  const { data, isLoading } = useQuery({
    queryKey: ["audio"],
    queryFn: audioService.getAudioList,
  });

  return (
    <div className="py-10 dark:text-gray-300">
      <h2 className="text-xl font-bold dark:text-white mb-2">Audio List</h2>
      <DataTable
        columns={columns}
        isLoading={isLoading}
        data={data?.data?.docs || []}
      />
    </div>
  );
}

export default AudioList;
