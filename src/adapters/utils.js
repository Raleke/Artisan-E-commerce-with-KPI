import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
function GetUserId() {
  const { auth } = useAuth();

  if (auth.userId) {
    try {
      return auth.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}
function handleError(error) {
  console.error("Error submitting data:", error);
  toast.error(error.response?.data?.error || "An error occurred");
  throw new Error("an error occurred");
}
export { GetUserId, handleError };
