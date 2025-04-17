import { useTokenStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const fetchUserData = async () => {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
};

export const useUserData = () => {
  const { data: session, status: sessionStatus } = useSession();

  const userDataQuery = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    enabled: !!session?.user,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const setTokenBalance = useTokenStore((state) => state.setTokenBalance);

  useEffect(() => {
    if (userDataQuery.data) {
      setTokenBalance(userDataQuery.data.balance);
    }
  }, [userDataQuery.data, setTokenBalance]);

  return {
    session,
    sessionStatus,
    ...userDataQuery,
  };
};