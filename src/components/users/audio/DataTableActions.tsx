"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Eye, Loader, Trash } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { audioService } from "@/lib/api/audio";
import { DownloadButton } from "./DownloadButton";

interface DataTableActionsProps<TData> {
  row: Row<TData>;
}

/**
 * Component nút hành động cho bảng
 */
function DataTableActions<TData>({ row }: DataTableActionsProps<TData>) {
  const audio = row.original as Audio;
  const queryClient = useQueryClient();

  // State cho các modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);

  // Kiểm tra audio đã sẵn sàng chưa
  const isAudioReady = !!audio.audioLink && audio.progress === 100;

  // Mutation để xóa audio
  const { isPending, mutate } = useMutation({
    mutationFn: audioService.deleteAudio,
    onSuccess: () => {
      toast.success("Xóa audio thành công");
      queryClient.invalidateQueries({ queryKey: ["audio"] });
    },
  });

  return (
    <div className="flex items-center gap-1.5">
      {/* Nút xem nội dung */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-muted"
              onClick={() => setIsContentModalOpen(true)}
            >
              <Eye className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Xem nội dung</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Nút tải xuống */}
      <DownloadButton audio={audio} isAudioReady={isAudioReady} />

      {/* Nút xóa */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-destructive/20"
              disabled={isPending}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Trash className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Xóa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Modal Xem Nội Dung */}
      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nội dung</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-4 whitespace-pre-wrap">
            {audio.content}
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Đóng</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Xác nhận xóa */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Audio sẽ bị xóa vĩnh viễn khỏi
              hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => mutate(audio._id)}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DataTableActions;
