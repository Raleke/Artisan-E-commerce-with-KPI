import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
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
  console.log(error.response.data);
  toast.error(error.response?.data?.msg || "An error occurred");
  throw new Error("an error occurred");
}
export { GetUserId, handleError };
