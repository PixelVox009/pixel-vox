"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";

import { Badge } from "@/components/ui/badge";
import { saveFile } from "@/utils/saveFile";
import DataTableActions from "./DataTableActions";

export const columns: ColumnDef<Image>[] = [
  {
    accessorKey: "title",
    header: () => <div className="text-left">Title</div>,
    size: 200,
    cell: ({ row }) => <TitleRow row={row} />,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    size: 120,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.getValue("status")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-center">Created At</div>,
    size: 180,
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt")).toLocaleString();

      return <div className="text-center">{createdAt}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 120,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <DataTableActions row={row} />
      </div>
    ),
  },
];

type TitleRowProps<TData> = {
  row: Row<TData>;
};

function TitleRow<TData>({ row }: TitleRowProps<TData>) {
  const image = row.original as Image;
  const [openLightBox, setOpenLightBox] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {image.imageLink ? (
        <>
          <Image
            src={image.imageLink}
            alt={row.getValue("title")}
            width={100}
            height={100}
            className="object-cover rounded-lg cursor-pointer"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundColor = "#1D9CF6";
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
                saveFile(image.imageLink, image.title);
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
