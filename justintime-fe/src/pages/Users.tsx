import { deleteUser, getUsersWithDetails} from "@/services/UserService";
import { getSchools } from "@/services/SchoolService";
import { useEffect, useState } from "react";
import TableComponent from "@/components/Table/Table";
import { FlattenedUser, User } from "@/types/user.types";
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
import { createUserAdmin } from "@/services/AdminServices";

const roles = createListCollection({
  items: [
    { label: "School Administrator", value: "admin" },
    { label: "Teacher", value: "teacher" },
    { label: "Student", value: "student" },
  ],
})

const Users = () => {
  const [users, setUsers] = useState<unknown[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchoolName, setSelectedSchoolName] = useState("");
  const [edititngUser, setEditingUser] = useState<FlattenedUser | null>(null);
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
    if (selectedSchoolName.length >= 3) {
      fetchSchools();
    } else {
      setResults([]);
    }
  }, [isDialogOpen, selectedSchoolName]);

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
    setEditingUser(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSchoolId("");
    setRole("");
    setIsDialogOpen(false);
  };


  const handleSaveUser = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    if (edititngUser) {
      // Edit user
      const updatedUser = {
        id: edititngUser.id,
        name: fullName,
        email: email,
        school: schoolId,
        role: role,
      }
      console.log("Updating user", updatedUser);
      setIsDialogOpen(false);
    }
    const responseUser = await createUserAdmin(token, fullName, email, password, schoolId, role);
    if (!responseUser) {
      toaster.create({
        title: t('error'),
        description: t('failed_create_teacher'),
        type: "error",
      });
      throw new Error(t('failed_create_teacher'));
    }
    toaster.create({
      title: t('success'),
      description: t('teacher_added'),
      type: "success",
    });
    onClose();
    setIsDialogOpen(false);
  }

  const hadnleUserEdit = (user: FlattenedUser) => {
    if (!user) {
      throw new Error("User not found");
    }

    setFullName(user.name || "");
    setEmail(user.email || "");
    setSchoolId(Array.isArray(user.school) ? user.school[0] : user.school);
    setRole(user.role.length > 0 ? user.role[0] : "");
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleUserDelete = async (id: string) => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    try {
      await deleteUser(token, id);
      toaster.create({
        title: t('success'),
        description: t('user_deleted_successfully'),
        type: "success",
      });
      fetchUsers();
    } catch {
      toaster.create({
        title: t('error'),
        description: t('user_delete_failed'),
        type: "error",
      });
    }
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
        onAdd={() => setIsDialogOpen(true)} // Open the form
        onEdit={(item)=>hadnleUserEdit(item as unknown as FlattenedUser)}
        onDelete={handleUserDelete}
      />
      <DialogRoot open={isDialogOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>{edititngUser ? t('edit_user') : t('add_new_user')}</DialogHeader>
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
