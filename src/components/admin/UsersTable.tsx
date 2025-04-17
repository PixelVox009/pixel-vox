import { UserData } from "@/types/users";
import { AlertCircle, Loader2, Users } from "lucide-react";
import { UserRow } from "./UserRow";

interface UsersTableProps {
  data: UserData[];
  isLoading: boolean;
  error: unknown;
  onGift: (user: UserData) => void;
  vndToUsdRate: number;
}

export const UsersTable = ({ data, isLoading, error, onGift, vndToUsdRate }: UsersTableProps) => (
  <div className="bg-background border border-border rounded-md shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/30">
            <th className="py-3 px-4 font-medium text-muted-foreground w-[25%]">Name</th>
            <th className="py-3 px-4 font-medium text-muted-foreground text-center w-[12%]">Payment Code</th>
            <th className="py-3 px-4 font-medium text-muted-foreground text-center w-[12%]">Total credits</th>
            <th className="py-3 px-4 font-medium text-muted-foreground text-center w-[12%]">Total Spent</th>
            <th className="py-3 px-4 font-medium text-muted-foreground text-center w-[12%]">Total Recharged</th>
            <th className="py-3 px-4 font-medium text-muted-foreground text-center w-[10%]">Role</th>
            <th className="py-3 px-4 font-medium text-muted-foreground text-right w-[17%]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading users...
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="h-24 text-center">
                <div className="flex items-center justify-center text-destructive">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Error loading users
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={7} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center">
                  <Users className="h-10 w-10 mb-2 opacity-40" />
                  No users found
                </div>
              </td>
            </tr>
          ) : (
            data.map((user) => <UserRow key={user._id} user={user} onGift={onGift} vndToUsdRate={vndToUsdRate} />)
          )}
        </tbody>
      </table>
    </div>
  </div>
);
