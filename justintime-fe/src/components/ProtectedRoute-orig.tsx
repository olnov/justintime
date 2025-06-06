import { Navigate } from "react-router-dom";
import { isAuthenticated, parseToken } from "@/services/AuthService";

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: string[];
  globalAdminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles = [], globalAdminOnly = false }) => {
  const token = localStorage.getItem("token");
  if (!token || !isAuthenticated()) return <Navigate to="/login" replace />;


  let userInfo;
  try {
    userInfo = parseToken(token);
  } catch {
    // In case token is malformed
    return <Navigate to="/login" replace />;
  }
  // const userInfo = parseToken(token);
  const isGlobalAdmin = userInfo.isGlobalAdmin;
  const schoolRoles = userInfo.schools?.flatMap((school: { roles: string[] }) => school.roles) || [];
  const schoolId = userInfo.schools?.[0]?.id || null;

  if (globalAdminOnly && !isGlobalAdmin) return <Navigate to="/admin/dashboard" />;
  if (allowedRoles.length > 0 && !allowedRoles.some(role => schoolRoles.includes(role))) return <Navigate to={`/${schoolId}/dashboard`} />;

  return element;
};

export default ProtectedRoute;
