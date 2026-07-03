import { useGetProfileQuery } from "@/services/api/authApi";

export function useProfile() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery();

  return {
    user: data?.user,
    isLoading,
    error,
    refetch,
  };
}