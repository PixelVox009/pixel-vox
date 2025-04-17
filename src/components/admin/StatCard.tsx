import { Card, CardContent } from "@/components/ui/card";
import { StatCardProps } from "@/types/dashboard";

export function StatCard({ icon, title, value, iconBgColor, iconColor, isLoading = false }: StatCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor} dark:opacity-80`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold dark:text-gray-200">{isLoading ? "Đang tải..." : value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
