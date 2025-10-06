import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return user.role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/" replace />;
  }

  return children;
}
