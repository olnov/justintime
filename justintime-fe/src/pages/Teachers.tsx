import { Heading, Button, Stack, Input, Textarea, Box, Text, Field } from "@chakra-ui/react";
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
import { getTeacherBySchoolId, deleteTeacher, updateTeacher } from "@/services/TeacherService";
import { parseToken } from "@/services/AuthService";
import { Teacher, FlattenedTeacher } from "@/types/teacher.types";
import { toaster } from "@/components/ui/toaster";
import { useTranslation } from 'react-i18next';
import { createTeacherAdmin, generateInvitationLink } from "@/services/AdminServices";
import { PasswordInput } from "@/components/ui/password-input";


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
  const [invitationLink, setInvitationLink] = useState<string>("");
  const ROLE = "teacher";
  const token = localStorage.getItem("token");
  const schoolId = parseToken(token as string).schools[0].id;
  // Pagination options
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTeachersBySchool();
  }, [isDialogOpen, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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

  // Generate invitation link for a teacher
  const handleGenerateInvitationLink = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    try {
      const link = await generateInvitationLink(token, schoolId, email);
      setInvitationLink(link.data);
      toaster.create({
        title: t('success'),
        description: t('invitation_link_generated') + `\n ${link}`,
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: t('error'),
        description: t('failed_generate_invitation_link') + `\n ${error}`,
        type: "error",
      });
    }
  }

  
  // Function to handle saving a teacher (both add and edit modes)
  const handleSaveTeacher = async () => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    if (editingTeacher) {
      // Edit mode: update the teacher record.
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
      const result = await updateTeacher(token, updatedTeacher);

      if (result?.status && result.status !== 200 && result.status !== 204) {
        const description =
          result.status === 409
            ? t('email_already_exists')
            : t('failed_update_teacher');

        toaster.create({
          title: t('error'),
          description,
          type: 'error',
        });
        return;
      }

      toaster.create({
        title: t('success'),
        description: t('teacher_updated'),
        type: 'success',
      });
      onClose();
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
      const newTeacher = await createTeacherAdmin(token, fullName, email, password, schoolId, ROLE, specialization, parseFloat(rating), bio);
      console.log(newTeacher.status)
      if (newTeacher.status === 200 || newTeacher.status === 201) {
        toaster.create({
          title: t('success'),
          description: t('teacher_added'),
          type: 'success',
        });
        onClose();
        return;
      }

      // Catching email already exists error
      if (newTeacher.status === 409) {
        toaster.create({
          title: t('error'),
          description: t('email_already_exists'),
          type: 'error',
        });
        return;
      }

      toaster.create({
        title: t('error'),
        description: t('failed_create_teacher'),
        type: 'error',
      });
      return;
    }
  };

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
    } catch (error) {
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
      const skip = (currentPage - 1) * pageSize;
      const take = pageSize;
      const data = await getTeacherBySchoolId(token, schoolId, skip, take);
      setTeachers(data.data);
      setTotalCount(data.totalCount);
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
      <Box bgColor={"white"} borderRadius="xs" boxShadow="xs" p={4}>
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
          pageSize={pageSize}
          onPageChange={handlePageChange}
          totalCount={totalCount}
        />
        <DialogRoot open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
          <DialogContent>
            <DialogHeader><Text fontSize={"md"}>{editingTeacher ? t('edit_teacher') : t('add_new_teacher')}</Text></DialogHeader>
            <DialogBody pb="4">
              <Stack>
                <Field.Root required>
                  <Field.Label>
                  {t('full_name')}<Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    type="text"
                    placeholder={t('full_name')}
                    name="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>
                    {t('email')}<Field.RequiredIndicator />
                  </Field.Label>
                <Input
                  type="email"
                  placeholder={t('email')}
                  name="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
                </Field.Root>
                {/* Show password fields only in add mode */}
                {!editingTeacher && (
                  <>
                    {/* <Field.Root required>
                      <Field.Label>
                        {t('password')}<Field.RequiredIndicator />
                      </Field.Label>
                    <PasswordInput
                      name="password"
                      placeholder={t('password')}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>
                        {t('confirm_password')}<Field.RequiredIndicator />
                      </Field.Label>
                    <PasswordInput
                      name="confirmPassword"
                      placeholder={t('confirm_password')}
                      value={confirmPassword}
                      required
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Field.Root> */}
                    {/* <Field.Root>
                      <Field.Label>
                        {t('invitation_link')}
                      </Field.Label>
                      <Textarea
                        placeholder={t('invitation_link')}
                        name="invitationLink"
                        value={invitationLink}
                        onChange={(e) => setInvitationLink(e.target.value)}
                      />
                    </Field.Root> */}
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
                    value={rating}
                    onValueChange={(e) => setRating(e.value)}
                  >
                    <NumberInputField
                      name="rating"
                    />
                  </NumberInputRoot>
                  {invitationLink && (
                    <Box mt={4}>
                      <Text mb={1}>{t('give_this_link_to_user')}:</Text>
                      <Input readOnly value={invitationLink} />
                      <Button onClick={() => navigator.clipboard.writeText(invitationLink)} size="sm" mt={2}>
                        {t('copy_link')}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Stack>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" bgColor="blue.300" onClick={handleGenerateInvitationLink}>
                {t('generate_invitation_link')}
              </Button>
              <Button variant="outline" bgColor="green.300" onClick={handleSaveTeacher}>
                {t('save')}
              </Button>
              <Button variant="outline" bgColor="red.300" onClick={onClose}>
                {t('cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
    </>
  );
};

export default Teachers;