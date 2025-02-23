import { Heading, Button, Stack, Input, Box, Text } from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input"
import TableComponent from "@/components/Table";
import { useState, useEffect } from "react";
import { getStudentsWithSchools, getStudentBySchoolId } from "@/services/StudentService";
import { parseToken } from "@/services/AuthService";
import { toaster } from "@/components/ui/toaster";
import { createUser } from "@/services/UserService";
import { createUserSchool } from "@/services/UserSchoolService";
import { createRoleAssignment } from "@/services/RoleAssignmentService";
import { createStudent } from "@/services/StudentService";
import { Student } from "@/types/student.types";


const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState<string>("0.00");
  const ROLE = "student";


  useEffect(() => {
    // fetchStudentsWithSchools();
    fetchStudentsBySchool();
  }, [isFormOpen]);


  // const fetchStudentsWithSchools = async () => {
  //   if (token) {
  //     const data = await getStudentsWithSchools(token);
  //     setStudents(data);
  //   } else {
  //     throw new Error("You are not authenticated");
  //   }
  // }


  const fetchStudentsBySchool = async () => {
    if (token) {
      const schoolId = parseToken(token).schools[0].id;
      const data = await getStudentBySchoolId(token, schoolId);
      setStudents(data);
    } else {
      throw new Error("You are not authenticated");
    }
  }

  const handleOnChangeRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGradeLevel(e.target.value);
  }

  const handleSaveStudent = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    // Step 1: Validate password
    if (password !== confirmPassword) {
      toaster.create({
        title: "Error",
        description: "Passwords do not match",
        type: "error",
      });
      return;
    }
    // Step 2: Create user
    const newUser = await createUser(fullName, email, password);
    if (!newUser) {
      toaster.create({
        title: "Error",
        description: "Failed to create user",
        type: "error",
      });
      return;
    }
    // Step 3: Adding user and school relationship.
    const schoolId = parseToken(token).schools[0].id;
    const newUserSchool = await createUserSchool(token, newUser.id, schoolId);
    if (!newUserSchool) {
      toaster.create({
        title: "Error",
        description: "Failed to create user school relationship",
        type: "error",
      });
      return;
    }
    // Step 4: Registering a teacher role for the user
    const teacherRoleAssignment = await createRoleAssignment(token, newUserSchool.id, ROLE);
    if (!teacherRoleAssignment) {
      toaster.create({
        title: "Error",
        description: "Failed to register role for user",
        type: "error",
      });
      return;
    }
    // Step 5: Create teacher
    const newTeacher = await createStudent(token, newUserSchool.id);
    if (!newTeacher) {
      toaster.create({
        title: "Error",
        description: "Failed to create student",
        type: "error",
      });
      return;
    } else {
      toaster.create({
        title: "Success",
        description: "Student added successfully",
        type: "success",
      });
      onClose();
    }
  }

  const onClose = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsFormOpen(false);
  }

  const flattenedSudents = students.map((student: Student) => ({
    id: student.id,
    name: student.userSchool?.user?.name || "N/A",
    school: student.userSchool?.school?.name || "N/A",
    email: student.userSchool?.user?.email || "N/A",
    gradeLevel: student.gradeLevel || "N/A",
  }));


  return (
    <>
      <Heading>Students</Heading>
      <TableComponent
        title="Students"
        data={flattenedSudents}
        columns={[
          { key: "name", label: "Student Name", sortable: true },
          { key: "school", label: "School", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "gradeLevel", label: "Grade Level", sortable: true },
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
          <DialogHeader>Add new student</DialogHeader>
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
              <Box>
                <Text>Grade Level</Text>
                <NumberInputRoot
                  step={0.1}
                  max={5}
                  min={0}
                  formatOptions={{ style: "decimal", minimumFractionDigits: 2 }}
                  defaultValue="0.00"
                >
                  {/* <NumberInputLabel>Grade Level</NumberInputLabel> */}
                  <NumberInputField
                    name="gradeLevel"
                    // value={rating}
                    onChange={(e) => handleOnChangeRating(e)}
                  />
                </NumberInputRoot>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={"outline"} bgColor="green.300" onClick={handleSaveStudent}>
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

export default Students;