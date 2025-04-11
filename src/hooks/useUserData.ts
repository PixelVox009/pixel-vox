import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const fetchUserData = async () => {
    const res = await fetch("/api/user");
    if (!res.ok) throw new Error("Failed to fetch user data");
    return res.json();
};

export const useUserData = () => {
    const { data: session, status: sessionStatus } = useSession();

    const query = useQuery({
        queryKey: ["userData"],
        queryFn: fetchUserData,
        enabled: sessionStatus === "authenticated" && !!session?.user,
    });

    return {
        session,
        sessionStatus,
        ...query,
    };
};
