import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Info } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TransactionHeader = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/admin/users" className="hover:text-primary">
            <Button variant="link" className="p-0">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Users
            </Button>
          </Link>
          <span>/</span>
          <span>Transaction History</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View all transaction details and history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};
