import { Navigate } from "react-router-dom";
import authService from "../lib/authService";

export default function ProtectedRoute({ children, role }) {
  const user = authService.getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;

  if (role && !user.roles?.includes(role)) {
    return user.roles?.includes("admin")
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return children;
}
