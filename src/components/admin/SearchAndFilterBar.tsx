import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchAndFilterBarProps } from "@/types/users";
import { Search } from "lucide-react";


export const SearchAndFilterBar = ({ search, setSearch, role, onRoleChange, onSearch }: SearchAndFilterBarProps) => (
  <div className="flex justify-between mb-6">
    <div className="flex gap-3">
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-[250px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    </div>

    <div className="flex items-center gap-2">
      <Button variant="outline">Export</Button>
    </div>
  </div>
);
