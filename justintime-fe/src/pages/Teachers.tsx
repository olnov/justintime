import { Heading, Button, Stack, Input, Box, List, Spinner, Text, Portal, createListCollection } from "@chakra-ui/react";
import TableComponent from "@/components/Table";
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
import { useState, useEffect } from "react";
import { getTeachersWithSchools, getTeacherBySchoolId } from "@/services/TeacherService";
import { parseToken } from "@/services/AuthService";

interface Teacher {
  id?: number;
  userSchool?: {
    user?: {
      name?: string;
      email?: string;
    };
    school?: {
      name?: string;
    };
  };
  specialization?: string;
  bio?: string;
  rating?: number;
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSchoolName, setSelectedSchoolName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const roles = createListCollection({
    items: [
      { label: "School Administrator", value: "admin" },
      { label: "Teacher", value: "teacher" },
      { label: "Student", value: "student" },
    ],
  })
  const token = localStorage.getItem("token");


  useEffect(() => {
    // fetchTeachersWithSchools();
    fetchTeachersBySchool();
  }, [isFormOpen]);

  const onClose = () => {
    setIsFormOpen(false);
  };

  const handleSaveUser = () => {
    console.log("Save user");
  };

  const fetchTeachersBySchool = async () => {
    if (token) {
      const schoolId = parseToken(token).schools[0].id;
      const data = await getTeacherBySchoolId(token, schoolId);
      setTeachers(data);
    } else {
      throw new Error("You are not authenticated");
    }
  }

  const flattenedTeachers = teachers.map((teacher: Teacher) => ({
    id: teacher.id,
    name: teacher.userSchool?.user?.name || "N/A",
    school: teacher.userSchool?.school?.name || "N/A",
    email: teacher.userSchool?.user?.email || "N/A",
    specialisation: teacher.specialization || "N/A",
    bio: teacher.bio || "N/A",
    rating: teacher.rating || 0,
  }));


  return (
    <>
      <Heading>Teachers</Heading>
      <TableComponent
        title="Teachers"
        data={flattenedTeachers}
        columns={[
          { key: "name", label: "Teacher Name", sortable: true },
          { key: "school", label: "School", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "specialisation", label: "Specialisation", sortable: true },
          { key: "bio", label: "Bio", sortable: true },
          { key: "rating", label: "Rating", sortable: true },
        ]}
        onAdd={() => setIsFormOpen(true)}
        actions={
          <>
            <Button variant={"outline"}>Delete</Button>
            <Button variant={"outline"}>Edit</Button>
          </>
        }
      />
      <DialogRoot open={isFormOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
          <DialogHeader>Add new teacher</DialogHeader>
          <DialogBody pb="4">
            <Stack>
              <Input
                type="text"
                placeholder="Full Name"
                name="name"
                value={fullName}
                required={true}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                required={true}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <SelectRoot variant={"outline"} collection={roles}>
                <SelectLabel>Select role</SelectLabel>
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
              Save
            </Button>
            <Button variant="outline" bgColor={"red.300"} onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default Teachers;