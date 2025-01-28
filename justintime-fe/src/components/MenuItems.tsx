import { Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaSchool, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { CgUser } from "react-icons/cg";

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
  const userRole = localStorage.getItem("userRole") as keyof typeof menuItemsByRole;
  const menuItems = menuItemsByRole[userRole] || [];

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
