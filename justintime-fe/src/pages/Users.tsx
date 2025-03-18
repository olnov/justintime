import { createUser, getUsersWithDetails} from "@/services/UserService";
import { getSchools } from "@/services/SchoolService";
import { createUserSchool } from "@/services/UserSchoolService";
import { createRoleAssignment } from "@/services/RoleAssignmentService";
import { createTeacher } from "@/services/TeacherService";
import { createStudent } from "@/services/StudentService";
import { useEffect, useState } from "react";
import TableComponent from "@/components/Table/Table";
import { User } from "@/types/user.types";
import {
  Heading,
  Button,
  Input,
  Stack,
  Portal,
  createListCollection,
  Spinner,
  Box,
  List,
  Text,
} from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { toaster } from "@/components/ui/toaster";
import { useTranslation } from "react-i18next";

const roles = createListCollection({
  items: [
    { label: "School Administrator", value: "admin" },
    { label: "Teacher", value: "teacher" },
    { label: "Student", value: "student" },
  ],
})

const Users = () => {
  const [users, setUsers] = useState<unknown[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolName, setSelectedSchoolName] = useState("");
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
    if (selectedSchoolName.length >= 3) {
      fetchSchools();
    } else {
      setResults([]);
    }
  }, [isFormOpen, selectedSchoolName]);

  const fetchUsers = async () => {
    if (token) {
      const data = await getUsersWithDetails(token);
      setUsers(data);
    } else {
      throw new Error("You are not authenticated");
    }
  };

  const fetchSchools = async () => {
    if (token) {
      setLoading(true);
      const data = await getSchools(token);
      const filteredData = data.filter((school: { name: string; }) => school.name.toLowerCase().includes(selectedSchoolName.toLowerCase()));
      setResults(filteredData);
      setLoading(false);
    } else {
      throw new Error("You are not authenticated");
    }
  };

  const handleSelectSchool = (school: {id: string, name: string;}) => {
    setSchoolId(school.id);
    setSelectedSchoolName(school.name);
    setResults([]);
  };

  const onClose = () => {
    setIsFormOpen(false);
  };

  const handleSaveUser = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    const responseUser = await createUser(token, fullName, email, password);
    if (!responseUser) {
      toaster.create({
        title: "Failed to create user",
        description: responseUser.message,
        type: "error",
      });
      throw new Error(responseUser.message);
    }
    console.log("User created:", responseUser.id);

    const responseUserSchool = await createUserSchool(token, responseUser.id, schoolId);
    if (!responseUserSchool) {
      toaster.create({
        title: "Failed to create a user school relation",
        description: responseUserSchool.message,
        type: "error",
      });
      throw new Error(responseUserSchool.message);
    }
    console.log("User school relation created:", responseUserSchool.id);

    if (role === "admin") {
      const responseAdminRole = await createRoleAssignment(token, responseUserSchool.id, role);
      if (!responseAdminRole) {
        toaster.create({
          title: "Failed to create an admin",
          description: responseAdminRole.message,
          type: "error",
        });
        throw new Error(responseAdminRole.message);
      }
    }

    if (role === "teacher") {
      const responseTeacherRole = await createRoleAssignment(token, responseUserSchool.id, role);
      if (!responseTeacherRole) {
        toaster.create({
          title: "Failed to create a teacher",
          description: responseTeacherRole.message,
          type: "error",
        });
        throw new Error(responseTeacherRole.message);
      } else {
        const responseTeacher = await createTeacher(token, responseUserSchool.id);
        if (!responseTeacher) {
          toaster.create({
            title: "Failed to create a teacher",
            description: responseTeacher.message,
            type: "error",
          });
          throw new Error(responseTeacher.message);
        }
      }
    }

    if (role === "student") {
      const responseStudentRole = await createRoleAssignment(token, responseUserSchool.id, role);
      console.log("Student role created:", responseStudentRole);
      if (!responseStudentRole) {
        toaster.create({
          title: "Failed to create a student",
          description: responseStudentRole.message,
          type: "error",
        });
        throw new Error(responseStudentRole.message);
      } else {
        const responseStudent = await createStudent(token, responseUserSchool.id);
        console.log("Student created:", responseStudent);
        if (!responseStudent) {
          toaster.create({
            title: "Failed to create a student",
            description: responseStudent.message,
            type: "error",
          });
          throw new Error(responseStudent.message);
        }
      }
    }

    setIsFormOpen(false);
  };

  // Converting users to a table readable format
  const flattenedUsers = (users as User[]).map((user) => ({
    id: user.id,
    name: user.name || "N/A",
    email: user.email || "N/A",
    isGlobalAdmin: user.isGlobalAdmin ? "Yes" : "No", 
    school: user.UserSchools.map((schoolUser) => schoolUser.school.name).join(", ") || "N/A",
    role: user.UserSchools.flatMap((schoolUser) => schoolUser.roles.map((schoolRole) => schoolRole.role)).join(", ") || "N/A",
  }));
  

  return (
    <>
      <Heading>{t('users')}</Heading>
      <TableComponent
        title="Users"
        data={flattenedUsers}
        columns={[
          { key: "name", label: t('name'), sortable: true },
          { key: "email", label: t('email'), sortable: true },
          { key: "isGlobalAdmin", label: t('global_admin'), sortable: true },
          { key: "school", label: t('school'), sortable: true },
          { key: "role", label: t('role'), sortable: true },
        ]}
        onAdd={() => setIsFormOpen(true)} // Open the form
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
        // onDelete={}
        // onEdit={}
      />
      <DialogRoot open={isFormOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>{t('add_new_user')}</DialogHeader>
          <DialogBody pb="4">
            <Stack>
              <Input
                type="text"
                placeholder={t('full_name')}
                name="name"
                value={fullName}
                required={true}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                type="email"
                placeholder={t('email')}
                name="email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder={t('password')}
                name="password"
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder={t('confirm_password')}
                name="confirmPassword"
                value={confirmPassword}
                required={true}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Box position="relative" width="100%">
                <Input
                  type="text"
                  placeholder={t('school_name')}
                  name="schoolId"
                  value={selectedSchoolName}
                  onChange={(e) => setSelectedSchoolName(e.target.value)}
                />
                {selectedSchoolName.length >= 3 && results.length > 0 && (
                  <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    width="100%"
                    bgColor="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius={4}
                    zIndex={1500}
                  >
                    {loading ? (
                      <Box p="4" textAlign="center">
                        <Spinner size="sm" />
                        <Text>Loading...</Text>
                      </Box>
                    ) : results.length > 0 ? (
                      <List.Root>
                        {results.map((result) => (
                          <List.Item
                            key={result.id}
                            p="2"
                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                            onClick={() => handleSelectSchool(result)}
                          >
                            {result.name}
                          </List.Item>
                        ))}
                      </List.Root>
                    ) : (
                      <Box p="4" textAlign="center" color="gray.500">
                        No results found
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
              <SelectRoot variant={"outline"} collection={roles}>
                <SelectLabel>{t('select_role')}</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select role" />
                </SelectTrigger>
                <Portal>
                  <SelectContent
                    style={{
                      zIndex: 1500,
                    }}
                  >
                    {roles.items.map((roleItem) => (
                      <SelectItem item={roleItem} key={roleItem.value} onClick={() => setRole(roleItem.value)}>
                        {roleItem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Portal>
              </SelectRoot>
            </Stack>

          </DialogBody>
          <DialogFooter>
            <Button variant={"outline"} bgColor="green.300" onClick={handleSaveUser}>
              {t('save')}
            </Button>
            <Button variant="outline" bgColor={"red.300"} onClick={onClose}>
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default Users;
