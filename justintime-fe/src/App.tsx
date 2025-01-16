import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AdminPanel from './components/AdminPanel';
import Login from './pages/Login';
import Users from './pages/Users';
import Schools from './pages/Schools';
import Teachers from './pages/Teachers';
import Dashboard from './pages/Dashboard';
import './App.css';

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
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "schools",
        element: <Schools />,
      },
      {
        path: "teachers",
        element: <Teachers />,
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