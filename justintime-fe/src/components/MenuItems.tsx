import { Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaSchool, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import { parseToken } from "@/services/AuthService";

const menuItemsByRole = {
  global_admin: [
    { to: "/admin/users", label: "Users", icon: FaUsers },
    { to: "/admin/schools", label: "Schools", icon: FaSchool },
  ],
  admin: [
    { to: "/school/:schoolId/teachers", label: "Teachers", icon: FaChalkboardTeacher },
    { to: "/school/:schoolId/students", label: "Students", icon: FaUserGraduate },
    { to: "/school/:schoolId/schedule", label: "Schedule", icon: FaChalkboardTeacher },
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
  const token = localStorage.getItem("token");
  if (!token) return null; // Prevent crashes if token is missing

  const userInfo = parseToken(token);
  const isGlobalAdmin = userInfo.isGlobalAdmin;

  if (isGlobalAdmin) {
    return (
      <>
        {menuItemsByRole.global_admin.map((item) => (
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
  }

  // Handle school-based users (admins, teachers, students)
  if (userInfo.schools?.length > 0) {
    const schoolId = userInfo.schools[0].id; // ✅ Use the first school (or let the user select)
    const roles = userInfo.schools.flatMap((school) => school.roles);

    // Find the first matching role in `menuItemsByRole`
    const matchedRole = Object.keys(menuItemsByRole).find((role) =>
      roles.includes(role as any)
    ) as keyof typeof menuItemsByRole;

    if (!matchedRole) return null; // Prevent crashes if no role is found

    return (
      <>
        {menuItemsByRole[matchedRole].map((item) => (
          <ChakraLink asChild key={item.to}>
            <NavLink
              to={item.to.replace(":schoolId", schoolId)} // ✅ Replace dynamic school ID
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
  }

  return null; // No menu items if the user has no roles
};

export default MenuItems;
