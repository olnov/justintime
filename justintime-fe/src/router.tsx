import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminPanel from "@/components/AdminPanel";
import SchoolPanel from "@/components/SchoolPanel";
import LayoutWithoutNavbar from "@/components/LayoutWithoutNavbar";
import Login from "@/pages/Login";
import Users from "@/pages/Users";
import Schools from "@/pages/Schools";
import Teachers from "@/pages/Teachers";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import Schedule from "@/pages/Schedule";
import GlobalAdminDashboard from "@/pages/GlobalAdmin/GlobalAdminDashboard";
import StudentDashboard from "@/pages/Student/StudentDashboard";
import StudentProfile from "@/pages/Student/StudentProfile";
import TeacherProfile from "@/pages/Teacher/TeacherProfile";
import "./App.css";
import AccessDenied from "./pages/AccessDenided";

const router = createBrowserRouter([
  // ✅ Public Routes
  {
    path: "/",
    element: <LayoutWithoutNavbar />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
    ],
  },

  // ✅ Protected Admin Layout
  {
    path: "/admin",
    element: (
      <ProtectedRoute globalAdminOnly={true}>
        <AdminPanel />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <GlobalAdminDashboard /> },
      { path: "users", element: <Users /> },
      { path: "schools", element: <Schools /> },
    ],
  },

   // ✅ Protected School Layout
  {
    path: "/school/:schoolId",
    element: <SchoolPanel />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/profile",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "teacher/profile",
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <TeacherProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "teachers",
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Teachers />
          </ProtectedRoute>
        ),
      },
      {
        path: "students",
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher"]}>
            <Students />
          </ProtectedRoute>
        ),
      },
      {
        path: "schedule",
        element: (
          <ProtectedRoute allowedRoles={["admin", "teacher", "student"]}>
            <Schedule />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/403",
    element: <AccessDenied />,
  },  
]);

export default router;
