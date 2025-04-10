import React from "react";
import { DataTable } from "./DataTable";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";

const data: Audio[] = [
  {
    _id: "m5gr84i9",
    title: "316",
    status: "success",
    progress: 99,
    createdAt: "2023-10-01",
  },
  {
    _id: "m5gr84i9",
    title: "316",
    status: "success",
    progress: 99,
    createdAt: "2023-10-01",
  },
];

const getAudioList = async () => {
  const data = await fetch("/api/audio");
  return data.json();
};

function AudioList() {
  const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: getAudioList,
  });

  if (isLoading) return <div>loading...</div>;

  return (
    <div className="container mx-auto py-10 dark:text-gray-300">
      <h2 className="text-xl font-bold dark:text-white mb-2">Audio List</h2>
      <DataTable columns={columns} data={data.data.docs} />
    </div>
  );
}

export default AudioList;
