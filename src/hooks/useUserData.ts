import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useTokenStore } from "@/lib/store";

const fetchUserData = async () => {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
};
export const useUserData = () => {
  const { data: session, status: sessionStatus } = useSession();
  const setTokenBalance = useTokenStore((state) => state.setTokenBalance);
  const query = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    enabled: sessionStatus === "authenticated" && !!session?.user,
  });
  useEffect(() => {
    if (query.data) {
      setTokenBalance(query.data.balance);
    }
  }, [query, setTokenBalance]);
  return {
    session,
    sessionStatus,
    ...query,
  };
};
