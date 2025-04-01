import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { isAuthenticated, parseToken } from "@/services/AuthService";
import { Center, Spinner } from "@chakra-ui/react";
import { RawUser } from "@/types/user.types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  globalAdminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  globalAdminOnly = false,
}) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [userInfo, setUserInfo] = useState<RawUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !isAuthenticated()) {
      setAuthChecked(true);
      setIsAuth(false);
      return;
    }

    try {
      const info = parseToken(token);
      setUserInfo(info);
      setIsAuth(true);
    } catch (e) {
      console.warn("Invalid token:", e);
      setIsAuth(false);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  if (!authChecked) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const isGlobalAdmin = userInfo.isGlobalAdmin;
  const schoolRoles =
    userInfo.schools?.flatMap((school: { roles: string[] }) => school.roles) || [];

  if (globalAdminOnly && !isGlobalAdmin) {
    return <Navigate to="/403" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some((role) => schoolRoles.includes(role))
  ) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
