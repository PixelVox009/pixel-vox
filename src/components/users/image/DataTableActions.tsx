"use client";

import { Row } from "@tanstack/react-table";
import { ArrowDownToLine, Trash } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { imageService } from "@/lib/api/image";
import { saveFile } from "@/utils/saveFile";

type DataTableActionsProps<TData> = {
  row: Row<TData>;
};

function DataTableActions<TData>({ row }: DataTableActionsProps<TData>) {
  const image = row.original as Image;

  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  // Mutations
  const { isPending, mutate } = useMutation({
    mutationFn: imageService.deleteImage,
    onSuccess: () => {
      toast.success("Xoá image thành công");

      queryClient.invalidateQueries({ queryKey: ["image"] });
    },
  });

  const handleDelete = () => {
    mutate(image._id);
  };

  return (
    <div className="flex gap-2 justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-destructive/20"
              onClick={() => {
                saveFile(image.imageLink, image.title);
              }}
            >
              <ArrowDownToLine size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-destructive/20"
              disabled={isPending}
              onClick={() => setOpenDialog(true)}
            >
              <Trash size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive/80 hover:bg-destructive dark:text-white"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DataTableActions;
