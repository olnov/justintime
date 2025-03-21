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
import { useTranslation } from 'react-i18next';

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<FlattenedTeacher | null>(null);
  const { t } = useTranslation();

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
            title: t('success'),
            description: t('teacher_updated'),
            type: "success",
          });
          onClose();
        } catch {
          toaster.create({
            title: t('error'),
            description: t('failed_update_teacher'),
            type: "error",
          });
        }
      } else {
        // Add mode: create a new teacher.
        if (password !== confirmPassword) {
          toaster.create({
            title: t('error'),
            description: t('passwords_do_not_match'),
            type: "error",
          });
          return;
        }
        try {
          // Step 1: Create user
          const newUser = await createUser(token, fullName, email, password);
          if (!newUser) {
            toaster.create({
              title: t('error'),
              description: t('failed_create_user'),
              type: "error",
            });
            return;
          }
          // Step 2: Create user-school relationship
          const schoolId = parseToken(token).schools[0].id;
          const newUserSchool = await createUserSchool(token, newUser.id, schoolId);
          if (!newUserSchool) {
            toaster.create({
              title: t('error'),
              description: t('failed_create_user_school_relationship'),
              type: "error",
            });
            return;
          }
          // Step 3: Register teacher role
          const teacherRoleAssignment = await createRoleAssignment(token, newUserSchool.id, ROLE);
          if (!teacherRoleAssignment) {
            toaster.create({
              title: t('error'),
              description: t('failed_register_role'),
              type: "error",
            });
            return;
          }
          // Step 4: Create teacher
          const newTeacher = await createTeacher(token, newUserSchool.id, specialization, bio, parseFloat(rating));
          if (!newTeacher) {
            toaster.create({
              title: t('error'),
              description: t('failed_create_teacher'),
              type: "error",
            });
            return;
          } else {
            toaster.create({
              title: t('success'),
              description: t('teacher_added'),
              type: "success",
            });
          }
          onClose();
        } catch {
          toaster.create({
            title: t('error'),
            description: t('failed_create_teacher'),
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
          title: t('success'),
          description: t('teacher_deleted'),
          type: "success",
        });
        setTeachers((prev) => prev.filter((teacher) => teacher.id?.toString() !== teacherId));
      } catch {
        toaster.create({
          title: t('error'),
          description: t('failed_teacher_deletion'),
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
      } catch(error) {
        toaster.create({
          title: t('error'),
          description: t('failed_update_teacher') + `\n ${error}`,
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
        <Heading>{t('teachers')}</Heading>
        <TableComponent
          title="Teacher"
          data={flattenedTeachers}
          columns={[
            { key: "name", label: t('teacher_name'), sortable: true },
            { key: "school", label: t('school'), sortable: true },
            { key: "email", label: t('email'), sortable: true },
            { key: "specialisation", label: t('specialization'), sortable: true },
            { key: "bio", label: t('bio'), sortable: true },
            { key: "rating", label: t('rating'), sortable: true },
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
            <DialogHeader>{editingTeacher ? t('edit_teacher') : t('add_new_teacher')}</DialogHeader>
            <DialogBody pb="4">
              <Stack>
                <Input
                  type="text"
                  placeholder={t('full_name')}
                  name="name"
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder={t('email')}
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
                      placeholder={t('password')}
                      name="password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder={t('confirm_password')}
                      name="confirmPassword"
                      value={confirmPassword}
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </>
                )}
                <Textarea
                  placeholder={t('specialization')}
                  name="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
                <Textarea
                  placeholder={t('bio')}
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <Box>
                  <Text>{t('rating')}</Text>
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
                {t('save')}
              </Button>
              <Button variant="outline" bgColor="red.300" onClick={onClose}>
                {t('cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </>
    );
  };

  export default Teachers;
