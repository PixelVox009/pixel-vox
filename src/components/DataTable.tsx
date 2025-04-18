"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { match } from "ts-pattern";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  items: TData[];
  totalPages: number;
  isLoading: boolean;
  pageIndex: number;
  pageSize?: number;
  setPage: (pageIndex: number) => void;
}

/**
 * Component bảng dữ liệu với giao diện cân đối
 */
export function DataTable<TData, TValue>({
  columns,
  items,
  totalPages,
  isLoading,
  pageIndex,
  pageSize = 10,
  setPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: items,
    columns,
    pageCount: totalPages ?? -1,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;

      setPage(newPagination.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border shadow-sm">
      {/* Bảng dữ liệu với định dạng cố định chiều rộng */}
      <div className="relative overflow-x-auto">
        <Table className="table-fixed w-full">
          {/* Header của bảng */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30 dark:bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 font-medium text-foreground"
                    style={{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* Body của bảng */}
          <TableBody>
            {match({ isLoading, hasRows: table.getRowModel().rows.length > 0 })
              // Hiển thị loading
              .with({ isLoading: true }, () => (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-20 text-center">
                    <div className="flex justify-center items-center gap-3 text-muted-foreground">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              // Hiển thị dữ liệu
              .with({ isLoading: false, hasRows: true }, () =>
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`hover:bg-muted/20 border-b 
                      ${index % 2 === 0 ? "bg-background" : "bg-muted/5"}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-2.5 align-middle"
                        style={{
                          width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )
              // Hiển thị khi không có dữ liệu
              .otherwise(() => (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-20 text-center">
                    <div className="text-muted-foreground">Không tìm thấy dữ liệu</div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      <div className="px-4 py-2.5 flex items-center justify-between border-t bg-muted/5 dark:bg-gray-800">
        <div className="text-sm text-muted-foreground">
          <span className="tabular-nums">
            Page {pageIndex + 1} / {Math.max(totalPages, 1)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Nút trang trước */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Nút trang sau */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={isLoading || !table.getCanNextPage()}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
