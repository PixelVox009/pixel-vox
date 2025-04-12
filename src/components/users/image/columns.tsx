"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import DataTableActions from "./DataTableActions";
import Image from "next/image";

export const columns: ColumnDef<Image>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize flex gap-2 items-center">
        {row.original.imageLink ? (
          <Image
            src={row.original.imageLink}
            alt={row.getValue("title")}
            width={80}
            height={80}
            className="object-cover rounded-lg"
            onError={(e) => {
              // Fallback for missing images
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#8B5CF6";
              target.textContent = String(row.getValue("title")).charAt(0);
              target.style.display = "flex";
              target.style.justifyContent = "center";
              target.style.alignItems = "center";
              target.style.color = "white";
              target.style.fontSize = "1.5rem";
            }}
          />
        ) : (
          ""
        )}
        {row.getValue("title")}
      </div>
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
