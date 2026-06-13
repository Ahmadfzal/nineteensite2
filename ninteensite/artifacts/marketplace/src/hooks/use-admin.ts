import { useAdminMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export function useAdminGuard() {
  const { data, isLoading, isError } = useAdminMe();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && (isError || !data?.authenticated)) {
      navigate("/n19-panel");
    }
  }, [isLoading, isError, data, navigate]);

  return { isLoading, isAuthenticated: !!data?.authenticated };
}
