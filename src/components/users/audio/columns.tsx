"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DataTableActions from "./DataTableActions";

export const columns: ColumnDef<Audio>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.getValue("status")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <div className="capitalize">
        <Progress value={row.getValue("progress")} />
        {row.getValue("progress")}%
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt")).toLocaleString();

      return <div className="capitalize">{createdAt}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => <DataTableActions row={row} />,
  },
];
