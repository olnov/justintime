import { Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaSchool, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import { parseToken } from "@/services/AuthService";

const menuItemsByRole = {
  global_admin: [
    { to: "/users", label: "Users", icon: FaUsers },
    { to: "/schools", label: "Schools", icon: FaSchool },
    { to: "/teachers", label: "Teachers", icon: FaChalkboardTeacher },
    { to: "/students", label: "Students", icon: FaUserGraduate },
  ],
  school_admin: [
    { to: "/teachers", label: "Teachers", icon: FaChalkboardTeacher },
    { to: "/students", label: "Students", icon: FaUserGraduate },
  ],
  teacher: [
    { to: "/students", label: "Students", icon: FaUserGraduate },
  ],
  student: [
    { to: "/profile", label: "Profile", icon: CgUser },
  ],
};

const MenuItems = () => {
  const userRole = parseToken(localStorage.getItem("token") as string).schools.map((schoolRole: { roles: unknown; }) => schoolRole.roles).join(", ") as keyof typeof menuItemsByRole;
  const isGlobalAdmin = parseToken(localStorage.getItem("token") as string).isGlobalAdmin;
  console.log("User's role for menu:", userRole);
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
