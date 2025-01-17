import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { isAuthenticated } from "./services/AuthService";
import AdminPanel from './components/AdminPanel';
import Login from './pages/Login';
import Users from './pages/Users';
import Schools from './pages/Schools';
import Teachers from './pages/Teachers';
import Dashboard from './pages/Dashboard';
import './App.css';

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const LayoutWithoutNavbar = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithoutNavbar />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <AdminPanel />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "users",
        element: <ProtectedRoute element={<Users />} />,
      },
      {
        path: "schools",
        element: <ProtectedRoute element={<Schools />} />,
      },
      {
        path: "teachers",
        element: <ProtectedRoute element={<Teachers />} />,
      },
    ],
  },
]);

const App = () => {
  return (
    <>
    <RouterProvider router={router} />;
    <Toaster />
    </>
  )
};

export default App;