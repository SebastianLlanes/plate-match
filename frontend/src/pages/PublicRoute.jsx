import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) return null;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}