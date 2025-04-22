"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AudioPlayer from "./AudioPlayer";
import DataTableActions from "./DataTableActions";

/**
 * Định nghĩa các cột cho bảng audio với điều chỉnh kích thước cân đối
 */
export const columns: ColumnDef<Audio>[] = [
  // Cột tiêu đề
  {
    accessorKey: "title",
    header: "Title",
    size: 200,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-left font-medium w-[230px] truncate">{title}</div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">{title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  // Cột trạng thái
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    size: 100, // Cố định kích thước cột
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      // Xác định màu dựa vào trạng thái
      let className = "bg-gray-100 text-gray-800 ";
      if (status === "success") {
        className = "bg-green-100 text-green-800 border-green-600";
      } else if (status === "processing") {
        className = "bg-blue-100 text-blue-800 border-blue-600";
      } else if (status === "failed") {
        className = "bg-red-100 text-red-800 border-red-600";
      } else if (status === "pending") {
        className = "bg-yellow-100 text-yellow-800 border-yellow-600";
      }

      return (
        <div className="flex justify-center">
          <Badge variant="outline" className={`${className} text-xs px-2 py-1 rounded-full`}>
            {status}
          </Badge>
        </div>
      );
    },
  },

  // Cột tiến trìnhs
  {
    accessorKey: "progress",
    header: () => <div className="text-center">Progress</div>, // Căn giữa tiêu đề
    size: 180,
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number;
      return (
        <div className="flex items-center justify-center gap-2 w-full">
          {" "}
          <div className="flex items-center gap-2 w-[240px]">
            {" "}
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-sm font-medium tabular-nums w-[40px] text-right">{progress}%</span>
          </div>
        </div>
      );
    },
  },
  // Cột audio player
  {
    id: "audioPlayer",
    header: () => <div className="text-center">Audio</div>,
    size: 250,
    cell: ({ row }) => {
      const audio = row.original;
      const isReady = !!audio.audioLink && audio.progress === 100;
      return (
        <div className="flex justify-center w-full ">
          {" "}
          <AudioPlayer src={audio.audioLink || ""} title={audio.title} isReady={isReady} />
        </div>
      );
    },
  },
  // Cột thời gian tạo
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 170, // Cố định kích thước cột
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const date = new Date(createdAt);

      // Định dạng ngày giờ
      const formattedDate = format(date, "dd/MM/yyyy");
      const formattedTime = format(date, "HH:mm");

      return (
        <div className="flex items-center whitespace-nowrap">
          <CalendarIcon className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm tabular-nums">
            {formattedDate} {formattedTime}
          </span>
        </div>
      );
    },
  },

  // Cột hành động
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 140, // Cố định kích thước cột
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DataTableActions row={row} />
      </div>
    ),
  },
];
