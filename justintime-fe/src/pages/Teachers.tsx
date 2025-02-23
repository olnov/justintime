import { Heading, Button, Stack, Input, Textarea, Box, Text } from "@chakra-ui/react";
import TableComponent from "@/components/Table";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input"
import { useState, useEffect } from "react";
import { getTeacherBySchoolId } from "@/services/TeacherService";
import { parseToken } from "@/services/AuthService";
import { createUser } from "@/services/UserService";
import { createTeacher } from "@/services/TeacherService";
import { createUserSchool } from "@/services/UserSchoolService";
import { createRoleAssignment } from "@/services/RoleAssignmentService";
import { Teacher } from "@/types/teacher.types";
import { toaster } from "@/components/ui/toaster";




const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [rating, setRating] = useState<string>("0.00");
  const ROLE = "teacher";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachersBySchool();
  }, [isFormOpen]);

  const onClose = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSpecialization("");
    setBio("");
    setRating("0.00");
    setIsFormOpen(false);
  };

  const handleSaveTeacher = async () => {
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
    const newTeacher = await createTeacher(token, newUserSchool.id, specialization, bio, parseFloat(rating));
    if (!newTeacher) {
      toaster.create({
        title: "Error",
        description: "Failed to create teacher",
        type: "error",
      });
      return;
    } else {
      toaster.create({
        title: "Success",
        description: "Teacher created successfully",
        type: "success",
      });
    }
    onClose();
  };

  const handleOnChangeRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setRating("0.00");
    } else {
      setRating(value);
      console.log(value);
    }
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
              <Textarea
                placeholder="Specialization"
                name="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              <Textarea
                placeholder="Bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <Box>
                <Text>Rating</Text>
                <NumberInputRoot
                  step={0.1}
                  max={5}
                  min={0}
                  formatOptions={{ style: "decimal", minimumFractionDigits: 2 }}
                  defaultValue="0.00"
                >
                  <NumberInputField
                    name="rating"
                    // value={rating}
                    onChange={(e) => handleOnChangeRating(e)}
                  />
                </NumberInputRoot>
              </Box>
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button variant={"outline"} bgColor="green.300" onClick={handleSaveTeacher}>
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