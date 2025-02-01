import { Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaSchool, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import { parseToken } from "@/services/AuthService";

const menuItemsByRole = {
  global_admin: [
    { to: "/admin/users", label: "Users", icon: FaUsers },
    { to: "/admin/schools", label: "Schools", icon: FaSchool },
    // { to: "/teachers", label: "Teachers", icon: FaChalkboardTeacher },
    // { to: "/students", label: "Students", icon: FaUserGraduate },
  ],
  admin: [
    { to: "/school/teachers", label: "Teachers", icon: FaChalkboardTeacher },
    { to: "/students", label: "Students", icon: FaUserGraduate },
    { to: "/schedule", label: "Schedule", icon: FaChalkboardTeacher },
  ],
  teacher: [
    { to: "/profile", label: "Profile", icon: CgUser },
    { to: "/schedule", label: "My schedule", icon: FaChalkboardTeacher },
  ],
  student: [
    { to: "/profile", label: "Profile", icon: CgUser },
    { to: "/schedule", label: "Book a lesson", icon: FaChalkboardTeacher },
  ],
};

const MenuItems = () => {
  const userRole = parseToken(localStorage.getItem("token") as string).schools.map((schoolRole: { roles: unknown; }) => schoolRole.roles).join(", ") as keyof typeof menuItemsByRole;
  const isGlobalAdmin = parseToken(localStorage.getItem("token") as string).isGlobalAdmin;
  const menuItems = menuItemsByRole[userRole] || (isGlobalAdmin ? menuItemsByRole.global_admin : []);

  return (
    <>
      {menuItems.map((item) => (
        <ChakraLink asChild key={item.to}>
          <NavLink
            to={item.to}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              gap: "8px",
              color: "#b9babf",
              textDecoration: "none",
            }}
            className={({ isActive }) =>
              isActive ? "active-link" : "inactive-link"
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        </ChakraLink>
      ))}
    </>
  );
};

export default MenuItems;
