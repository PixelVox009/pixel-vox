import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserRowProps } from "@/types/users";
import { formatVndToUsd } from "@/utils/formatVndUseDola";
import { Activity, Edit, Gift, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";

export const UserRow = ({ user, onGift, vndToUsdRate }: UserRowProps) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <tr className="hover:bg-muted/20 border-b last:border-b-0">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-muted/50">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`} />
            <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-center font-mono text-sm">{user.paymentCode || "—"}</td>
      <td className="py-3 px-4 text-center">
        <span className="font-medium">{user.wallet?.totalTokens || 0}</span>
        <span className="text-xs text-muted-foreground ml-1">credits</span>
      </td>
      <td className="py-3 px-4 text-center">
        <span className="font-medium text-red-600">{user.wallet?.totalSpent || 0}</span>
        <span className="text-xs text-muted-foreground ml-1">credits</span>
      </td>
      <td className="py-3 px-4 text-center">
        <span className="font-medium">{formatVndToUsd(user.wallet?.totalRecharged || 0, vndToUsdRate)}</span>
        <span className="text-xs text-muted-foreground ml-1">$</span>
      </td>
      <td className="py-3 px-4 text-center">
        <Badge
          variant={user.role === "admin" ? "default" : "outline"}
          className={`px-2 py-0.5 ${user.role === "admin" ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
        >
          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onGift(user)}>
                <Gift className="h-4 w-4 text-emerald-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send credits</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4 text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit user</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/admin/users/${user._id}/transactions`} className="flex w-full items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  View transactions
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};
