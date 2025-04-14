"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";
import Download from "yet-another-react-lightbox/plugins/download";

import { Badge } from "@/components/ui/badge";
import DataTableActions from "./DataTableActions";

export const columns: ColumnDef<Image>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <TitleRow row={row} />,
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

type TitleRowProps<TData> = {
  row: Row<TData>;
};

function TitleRow<TData>({ row }: TitleRowProps<TData>) {
  const image = row.original as Image;
  const [openLightBox, setOpenLightBox] = useState(false);

  return (
    <div className="capitalize flex gap-2 items-center">
      {image.imageLink ? (
        <>
          <Image
            src={image.imageLink}
            alt={row.getValue("title")}
            width={80}
            height={80}
            className="object-cover rounded-lg cursor-pointer"
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
            onClick={() => setOpenLightBox(true)}
          />

          <Lightbox
            open={openLightBox}
            close={() => setOpenLightBox(false)}
            styles={{
              navigationNext: { display: "none" },
              navigationPrev: { display: "none" },
            }}
            slides={[
              {
                src: image.imageLink,
                alt: image.title,
                width: 3840,
                height: 2560,
                downloadUrl: image.imageLink,
              },
            ]}
            plugins={[Download]}
            on={{
              download: () => {
                // handle download image
              },
            }}
          />
        </>
      ) : (
        ""
      )}
      {row.getValue("title")}
    </div>
  );
}
