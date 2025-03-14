import { Heading, Button, Stack, Input, Textarea, Box, Text } from "@chakra-ui/react";
import TableComponent from "@/components/Table/Table";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";
import { useState, useEffect } from "react";
import { getTeacherBySchoolId, createTeacher, deleteTeacher, updateTeacher } from "@/services/TeacherService";
import { parseToken } from "@/services/AuthService";
import { createUser } from "@/services/UserService";
import { createUserSchool } from "@/services/UserSchoolService";
import { createRoleAssignment } from "@/services/RoleAssignmentService";
import { Teacher, FlattenedTeacher } from "@/types/teacher.types";
import { toaster } from "@/components/ui/toaster";

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<FlattenedTeacher | null>(null);

  // Form state variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // In add mode, we need password fields; in edit mode, these will be hidden.
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [rating, setRating] = useState<string>("0.00");
  const ROLE = "teacher";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachersBySchool();
  }, [isDialogOpen]);

  const onClose = () => {
    // Reset form fields and mode
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setSpecialization("");
    setBio("");
    setRating("0.00");
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleSaveTeacher = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    if (editingTeacher) {
      // Edit mode: update the teacher record.
      try {
        const updatedTeacher = {
          id: editingTeacher.id,
          specialization: specialization,
          bio: bio,
          rating: Number(rating),
          userData: {
            userId: editingTeacher.userId, 
            name: fullName, 
            email: email, 
          }
        };
        await updateTeacher(token, updatedTeacher);
          toaster.create({
            title: "Success",
            description: "Teacher updated successfully",
            type: "success",
          });
          onClose();
        } catch {
          toaster.create({
            title: "Error",
            description: "Failed to update teacher",
            type: "error",
          });
        }
      } else {
        // Add mode: create a new teacher.
        if (password !== confirmPassword) {
          toaster.create({
            title: "Error",
            description: "Passwords do not match",
            type: "error",
          });
          return;
        }
        try {
          // Step 1: Create user
          const newUser = await createUser(token, fullName, email, password);
          if (!newUser) {
            toaster.create({
              title: "Error",
              description: "Failed to create user",
              type: "error",
            });
            return;
          }
          // Step 2: Create user-school relationship
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
          // Step 3: Register teacher role
          const teacherRoleAssignment = await createRoleAssignment(token, newUserSchool.id, ROLE);
          if (!teacherRoleAssignment) {
            toaster.create({
              title: "Error",
              description: "Failed to register role for user",
              type: "error",
            });
            return;
          }
          // Step 4: Create teacher
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
        } catch {
          toaster.create({
            title: "Error",
            description: "An error occurred while creating teacher",
            type: "error",
          });
        }
      }
    };

    // const handleOnChangeRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const value = e.target.value;
    //   setRating(value === "" ? "0.00" : value);
    // };

    const handleTeacherDelete = async (teacherId: string) => {
      try {
        if (!token) throw new Error("Not authenticated");
        await deleteTeacher(token, teacherId);
        toaster.create({
          title: "Success",
          description: "Teacher deleted successfully",
          type: "success",
        });
        setTeachers((prev) => prev.filter((teacher) => teacher.id?.toString() !== teacherId));
      } catch {
        toaster.create({
          title: "Error",
          description: "Failed to delete teacher",
          type: "error",
        });
      }
    };

    const handleTeachersEdit = (teacher: FlattenedTeacher) => {
      try {
        if (!teacher) throw new Error("Teacher not found");
        // Populate form fields for editing.
        setFullName(teacher.name || "");
        setEmail(teacher.email || "");
        setSpecialization(teacher.specialisation || "");
        setBio(teacher.bio || "");
        setRating(teacher.rating.toString() || "0.00");
        setEditingTeacher(teacher);
        setIsDialogOpen(true);
      } catch {
        toaster.create({
          title: "Error",
          description: "Failed to edit teacher",
          type: "error",
        });
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
    };

    const flattenedTeachers = teachers.map((teacher: Teacher) => ({
      id: teacher.id || "",
      userId: teacher.userSchool?.userId || "",
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
          onAdd={() => {
            // Open the dialog in add mode.
            setEditingTeacher(null);
            setIsDialogOpen(true);
          }}
          onDelete={handleTeacherDelete}
          onEdit={(item) => handleTeachersEdit(item as unknown as FlattenedTeacher)}
        />
        <DialogRoot open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
          <DialogContent>
            <DialogHeader>{editingTeacher ? "Edit Teacher" : "Add New Teacher"}</DialogHeader>
            <DialogBody pb="4">
              <Stack>
                <Input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                {/* Show password fields only in add mode */}
                {!editingTeacher && (
                  <>
                    <Input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </>
                )}
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
                    value = {rating}
                    onValueChange={(e) => setRating(e.value)}
                  >
                    <NumberInputField
                      name="rating"
                    />
                  </NumberInputRoot>
                </Box>
              </Stack>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" bgColor="green.300" onClick={handleSaveTeacher}>
                Save
              </Button>
              <Button variant="outline" bgColor="red.300" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </>
    );
  };

  export default Teachers;
