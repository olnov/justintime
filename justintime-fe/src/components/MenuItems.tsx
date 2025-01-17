import { Link } from "@chakra-ui/react";
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
  const userRole = localStorage.getItem("userRole");
  
  const menuItems = menuItemsByRole[userRole] || [];

  return (
    <>
      {menuItems.map((item) => (
        <Link
          as={NavLink}
          to={item.to}
          display="flex"
          alignItems="center"
          p={2}
          gap={2}
          color="#b9babf"
          _hover={{ bg: "#161b2c", color: "#FFF" }}
          _active={{ bg: "#DEE5D4", color: "#8EACCD" }}
          _focus={{ bg: "#161b2c", color: "#FFF" }}
          key={item.to}
        >
          <item.icon />
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default MenuItems;