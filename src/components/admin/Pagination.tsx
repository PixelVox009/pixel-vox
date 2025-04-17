import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaginationProps } from "@/types/users";
import { ChevronLeft, ChevronRight } from "lucide-react";


export const Pagination = ({
  page,
  limit,
  totalPages,
  total,
  from,
  to,
  onPageChange,
  onLimitChange,
}: PaginationProps) => (
  <div className="flex items-center justify-between mt-4">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div>Rows per page:</div>
      <Select value={limit.toString()} onValueChange={(value) => onLimitChange(parseInt(value))}>
        <SelectTrigger className="h-8 w-16">
          <SelectValue placeholder={limit.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
      <div>
        {from || 0}-{to || 0} of {total || 0}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
