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
import Schedule from "./pages/Schedule";
import GlobalAdminDashboard from "./pages/GlobalAdmin/GlobalAdminDashboard";
import StudentDashboard from "./pages/Student/StudentDashboard";
import StudentProfile from "./pages/Student/StudentProfile";
import "./App.css";
import TeacherProfile from "./pages/Teacher/TeacherProfile";

const router = createBrowserRouter([
  // ✅ Public Routes (Login, No Navbar)
  {
    path: "/",
    element: <LayoutWithoutNavbar />, // ✅ Wraps Login Pages
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },
    ],
  },

  // ✅ Global Admin Routes
  {
    path: "/admin",
    element: <AdminPanel />, // ✅ Wraps Admin Pages
    children: [
      { path: "dashboard", element: <ProtectedRoute element={<GlobalAdminDashboard />} globalAdminOnly={true} /> },
      { path: "users", element: <ProtectedRoute element={<Users />} globalAdminOnly={true} /> },
      { path: "schools", element: <ProtectedRoute element={<Schools />} globalAdminOnly={true} /> },
    ],
  },

  // ✅ School-Specific Routes (Dynamic)
  {
    path: "/school/:schoolId",
    element: <SchoolPanel />, // ✅ Wraps School Pages
    children: [
      { path: "dashboard", element: <ProtectedRoute element={<Dashboard />} allowedRoles={["admin", "teacher"]} /> },
      { path: "student/dashboard", element: <ProtectedRoute element={<StudentDashboard />} allowedRoles={["student"]} /> },
      { path: "student/profile", element: <ProtectedRoute element={<StudentProfile />} allowedRoles={["student"]} /> },
      { path: "teacher/profile", element: <ProtectedRoute element={<TeacherProfile />} allowedRoles={["admin", "teacher"]} /> },
      { path: "teachers", element: <ProtectedRoute element={<Teachers />} allowedRoles={["admin", "teacher"]} /> },
      { path: "students", element: <ProtectedRoute element={<Students />} allowedRoles={["admin", "teacher"]} /> },
      { path: "schedule", element: <ProtectedRoute element={<Schedule />} allowedRoles={["admin","teacher","student"]} />},
    ],
  },
]);

export default router;