import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const UserHeader = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>New user</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2 text-sm">
        <Button variant="link" className="p-0">
          Dashboard
        </Button>
        <span>/</span>
        <Button variant="link" className="p-0">
          User
        </Button>
        <span>/</span>
        <span className="text-muted-foreground">List</span>
      </div>
    </>
  );
};
