import { useLocation, Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ type, children }) => {
  const { user, user_type } = useAuth();
  const location = useLocation();
  const redirect =
    type === "artisan"
      ? "/login/artisan"
      : type === "employer"
        ? "/login/employer"
        : "/admin/login";

  return user.id && user_type === type ? (
    children
  ) : (
    <Navigate to={redirect} state={{ from: location }} replace />
  );
};

export default RequireAuth;
