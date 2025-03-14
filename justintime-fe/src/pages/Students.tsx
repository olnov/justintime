import { Heading, Button, Stack, Input, Box, Text } from "@chakra-ui/react";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input"
import TableComponent from "@/components/Table/Table";
import { useState, useEffect } from "react";
import { getStudentBySchoolId, updateStudent, deleteStudent } from "@/services/StudentService";
import { parseToken } from "@/services/AuthService";
import { toaster } from "@/components/ui/toaster";
import { createUser } from "@/services/UserService";
import { createUserSchool } from "@/services/UserSchoolService";
import { createRoleAssignment } from "@/services/RoleAssignmentService";
import { createStudent } from "@/services/StudentService";
import { Student, FlattenedStudent } from "@/types/student.types";


const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gradeLevel, setGradeLevel] = useState<string>("0.00");
  const [editingStudent, setEditingStudent] = useState<FlattenedStudent | null>(null);
  const ROLE = "student";


  useEffect(() => {
    fetchStudentsBySchool();
  }, [isDialogOpen]);


  const fetchStudentsBySchool = async () => {
    if (token) {
      const schoolId = parseToken(token).schools[0].id;
      const data = await getStudentBySchoolId(token, schoolId);
      setStudents(data);
    } else {
      throw new Error("You are not authenticated");
    }
  }


  const handleStudentDelete = async (studentId: string) => {
        try {
          if (!token) throw new Error("Not authenticated");
          await deleteStudent(token, studentId);
          toaster.create({
            title: "Success",
            description: "Student deleted successfully",
            type: "success",
          });
          setStudents((prev) => prev.filter((student) => student.id?.toString() !== studentId));
        } catch {
          toaster.create({
            title: "Error",
            description: "Failed to delete srudent",
            type: "error",
          });
        }
      };

  const handleStudentEdit = (student: FlattenedStudent) => {
        try {
          if (!student) throw new Error("Student not found");
          // Populate form fields for editing.
          setFullName(student.name || "");
          setEmail(student.email || "");
          setGradeLevel(student.gradeLevel.toString() || "0.00");
          setEditingStudent(student);
          setIsDialogOpen(true);
        } catch {
          toaster.create({
            title: "Error",
            description: "Failed to edit student",
            type: "error",
          });
        }
      };

  const handleSaveStudent = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    // Editing mode
    if (editingStudent) {
      const updatedStrudent = {
        id: editingStudent.id,
        gradeLevel: gradeLevel,
        userData: {
          userId: editingStudent.userId,
          name: fullName,
          email: email,
        },
      }

      // Update student
      // console.log(updatedStrudent);
      const updatedStudent = await updateStudent(token, updatedStrudent);
      if (!updatedStudent) {
        toaster.create({
          title: "Error",
          description: "Failed to update student",
          type: "error",
        });
        return;
      } else {
        toaster.create({
          title: "Success",
          description: "Student updated successfully",
          type: "success",
        });
        onClose();
      }
      return;
    } else {
      // Adding mode

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
      const newUser = await createUser(token, fullName, email, password);
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
      // Step 4: Registering a student role for the user
      const studentRoleAssignment = await createRoleAssignment(token, newUserSchool.id, ROLE);
      if (!studentRoleAssignment) {
        toaster.create({
          title: "Error",
          description: "Failed to register role for user",
          type: "error",
        });
        return;
      }
      // Step 5: Create student
      const newStudent = await createStudent(token, newUserSchool.id);
      if (!newStudent) {
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
  }

  const onClose = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsDialogOpen(false);
    setEditingStudent(null);
  }

  const flattenedSudents = students.map((student: Student) => ({
    id: student.id || "",
    userId: student.userSchool?.userId || "",
    name: student.userSchool?.user?.name || "N/A",
    school: student.userSchool?.school?.name || "N/A",
    email: student.userSchool?.user?.email || "N/A",
    gradeLevel: student.gradeLevel || 0,
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
        onAdd={() => {
          setEditingStudent(null);
          setIsDialogOpen(true);
        }}
        onDelete={handleStudentDelete}
        onEdit={(item) => handleStudentEdit(item as unknown as FlattenedStudent)}
      />
      <DialogRoot open={isDialogOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent>
        <DialogHeader>{editingStudent ? "Edit Student" : "Add New Student"}</DialogHeader>
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
              {!editingStudent && (
                <>
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
                </>
              )}
              <Box>
                <Text>Grade Level</Text>
                <NumberInputRoot
                  step={0.1}
                  max={5}
                  min={0}
                  formatOptions={{ style: "decimal", minimumFractionDigits: 2 }}
                  value={gradeLevel}
                  onValueChange={(e) => setGradeLevel(e.value)}
                >
                  {/* <NumberInputLabel>Grade Level</NumberInputLabel> */}
                  <NumberInputField
                    name="gradeLevel"
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