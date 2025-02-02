import { apiClient } from "@/adapters/api";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await apiClient.get("users/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      return { ...prev, token: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
