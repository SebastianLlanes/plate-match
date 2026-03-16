import { useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReportForm from "../components/forms/ReportForm";

export default function ReportPage() {
  const { user, authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (authLoading) return null;

  if (!user) return <Navigate to="/login" />;

  if (!type || (type !== "lost" && type !== "found")) {
    return <Navigate to="/" />;
  }

  return <ReportForm type={type} />;
}