import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserData } from "@/types/users";
import { formatDate } from "@/utils/format";
import { formatVndToUsd } from "@/utils/formatVndUseDola";

interface UserInfoCardProps {
  userData: UserData | undefined;
  isLoading: boolean;
  getInitials: (name: string) => string;
  vndToUsdRate: number;
}

export const UserInfoCard = ({ userData, isLoading, getInitials, vndToUsdRate }: UserInfoCardProps) => {
  return (
    <Card className="border border-border/40 bg-background/60 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {isLoading ? (
            <Skeleton className="h-20 w-20 rounded-full" />
          ) : (
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(userData?.name || "")}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="space-y-1 flex-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{userData?.name}</h2>
                  {userData?.role === "admin" && (
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{userData?.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Payment Code: {userData?.paymentCode || "N/A"}</span>
                  <span>•</span>
                  <span>Joined {userData?.createdAt ? formatDate(userData.createdAt) : "N/A"}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="shadow-none border-border/40 min-w-[140px]">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    {userData?.wallet?.balance || 0}{" "}
                    <span className="text-sm font-normal text-muted-foreground">credits</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none border-border/40 min-w-[140px]">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Recharged</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                {isLoading ? (
                  <Skeleton className="h-6 w-20" />
                ) : (
                  <div className="text-2xl font-bold">
                    {formatVndToUsd(userData?.wallet?.totalRecharged || 0, vndToUsdRate)}
                    <span className="text-sm font-normal text-muted-foreground"> USD</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
