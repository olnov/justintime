import { Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaSchool, FaChalkboardTeacher, FaUserGraduate, FaCalendar } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import { parseToken } from "@/services/AuthService";
import { UserSchool } from "@/types/user.types";
import { useTranslation } from 'react-i18next';


const MenuItems = () => {
  const token = localStorage.getItem("token");
  const { t } = useTranslation();
  if (!token) return null; // Prevent crashes if token is missing

  const userInfo = parseToken(token);
  const isGlobalAdmin = userInfo.isGlobalAdmin;

  const menuItemsByRole = {
    global_admin: [
      { to: "/admin/users", label: t('users'), icon: FaUsers },
      { to: "/admin/schools", label: t('schools'), icon: FaSchool },
    ],
    admin: [
      { to: "/school/:schoolId/teachers", label: t('teachers'), icon: FaChalkboardTeacher },
      { to: "/school/:schoolId/students", label: t('students'), icon: FaUserGraduate },
      { to: "/school/:schoolId/schedule", label: t('schedule'), icon: FaCalendar },
    ],
    teacher: [
      { to: "/school/:schoolId/teacher/profile", label: t('profile'), icon: CgUser },
      { to: "/school/:schoolId/schedule", label: t('schedule'), icon: FaCalendar },
    ],
    student: [
      { to: "/school/:schoolId/student/profile", label: t('profile'), icon: CgUser },
      { to: "/school/:schoolId/schedule", label: t('schedule'), icon: FaCalendar },
    ],
  };


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
    const roles = userInfo.schools.flatMap((school:UserSchool) => school.roles);

    // Find the first matching role in `menuItemsByRole`
    const matchedRole = Object.keys(menuItemsByRole).find((role) =>
      roles.includes(role as string)
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
