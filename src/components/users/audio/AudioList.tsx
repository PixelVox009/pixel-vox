import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { audioService } from "@/lib/api/audio";
import { PAGE_SIZE } from "@/utils/constants";

function AudioList() {
  const [page, setPage] = useState<number>(0);

  const { data, isFetching } = useQuery({
    queryKey: ["audio", page],
    queryFn: () =>
      audioService.getAudioList({ page: page + 1, limit: PAGE_SIZE }),
  });

  return (
    <div className="py-10 dark:text-gray-300">
      <h2 className="text-xl font-bold dark:text-white mb-2">Audio List</h2>
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
  );
}

export default AudioList;
