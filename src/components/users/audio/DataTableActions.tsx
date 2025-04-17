"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { ArrowDownToLine, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

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
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { audioService } from "@/lib/api/audio";
import { saveFile } from "@/utils/saveFile";

type DataTableActionsProps<TData> = {
  row: Row<TData>;
};

function DataTableActions<TData>({ row }: DataTableActionsProps<TData>) {
  const audio = row.original as Audio;

  const [openDialog, setOpenDialog] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Mutations
  const { isPending, mutate } = useMutation({
    mutationFn: audioService.deleteAudio,
    onSuccess: () => {
      toast.success("Xoá audio thành công");

      queryClient.invalidateQueries({ queryKey: ["audio"] });
    },
  });

  const handleDelete = () => {
    mutate(audio._id);
  };

  const handleViewContent = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              variant="outline"
              className="h-8 w-8 p-0 dark:text-white dark:bg-gray-800 dark:border-gray-700"
              onClick={handleViewContent}
            >
              <Eye size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              disabled={!audio.audioLink || audio.progress !== 100}
              className="h-8 w-8 p-0 dark:text-white dark:bg-gray-800 dark:border-gray-700"
              onClick={() => {
                saveFile(audio.audioLink, audio.title);
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
              variant="destructive"
              size={"icon"}
              className="h-8 w-8 p-0"
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

      {/* Modal Xem Nội Dung */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Content</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4 whitespace-pre-wrap">{audio.content}</div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

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
