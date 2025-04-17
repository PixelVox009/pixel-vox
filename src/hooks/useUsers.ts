import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/lib/api/user";


export const useUsers = (initialPage = 1, initialLimit = 5) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["users", page, limit, search, role],
        queryFn: () => userService.fetchUsers(page, limit, search, role),
    });

    const handleRoleChange = (value: string) => {
        const roleFilter = value === "all" ? "" : value;
        setRole(roleFilter);
        setPage(1);
        refetch();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return {
        users: data?.users || [],
        pagination: data?.pagination,
        isLoading,
        error,
        page,
        limit,
        search,
        role,
        setSearch,
        setLimit,
        handleRoleChange,
        handleSearch,
        handlePageChange,
        refetch
    };
};