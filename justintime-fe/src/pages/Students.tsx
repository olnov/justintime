import { Heading, Button, Stack, Input, Box, Text, Field } from "@chakra-ui/react";
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
import { Student, FlattenedStudent } from "@/types/student.types";
import { useTranslation } from "react-i18next";
import { createStudentAdmin } from "@/services/AdminServices";


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
  const schoolId = parseToken(token as string).schools[0].id;
  const { t } = useTranslation();
  const ROLE = "student";
  // Pagination options
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(7);
  const [totalCount, setTotalCount] = useState(0);


  useEffect(() => {
    fetchStudentsBySchool();
  }, [isDialogOpen, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  }

  const fetchStudentsBySchool = async () => {
    if (token) {
      const skip = (currentPage - 1) * pageSize;
      const take = pageSize;
      const schoolId = parseToken(token).schools[0].id;
      const data = await getStudentBySchoolId(token, schoolId, skip, take);
      setStudents(data.data);
      setTotalCount(data.totalCount);
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

      // Check if the student was created successfully
      if (updatedStudent.status === 200 || updatedStudent.status === 201) {
        toaster.create({
          title: t('success'),
          description: t('student_added'),
          type: 'success',
        });
        onClose();
        return;
      }

      // Catching email already exists error
      if (updatedStudent.status === 409) {
        toaster.create({
          title: t('error'),
          description: t('email_already_exists'),
          type: 'error',
        });
        return;
      }

      toaster.create({
        title: t('error'),
        description: t('failed_create_student'),
        type: 'error',
      });
      return;
    } else {
      // Adding mode
      const newStudent = await createStudentAdmin(token, fullName, email, password, schoolId, ROLE, gradeLevel);
      // Check if the student was created successfully
      if (newStudent.status === 200 || newStudent.status === 201) {
        toaster.create({
          title: t('success'),
          description: t('student_added'),
          type: 'success',
        });
        onClose();
        return;
      }

      // Catching email already exists error
      if (newStudent.status === 409) {
        toaster.create({
          title: t('error'),
          description: t('email_already_exists'),
          type: 'error',
        });
        return;
      }

      toaster.create({
        title: t('error'),
        description: t('failed_create_student'),
        type: 'error',
      });
      return;
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
      <Box bgColor={"white"} borderRadius="xs" boxShadow="xs" p={4}>
        <Heading>{t('students')}</Heading>
        <TableComponent
          title="Students"
          data={flattenedSudents}
          columns={[
            { key: "name", label: t('student_name'), sortable: true },
            { key: "school", label: t('school'), sortable: true },
            { key: "email", label: t('email'), sortable: true },
            { key: "gradeLevel", label: t('grade_level'), sortable: true },
          ]}
          onAdd={() => {
            setEditingStudent(null);
            setIsDialogOpen(true);
          }}
          onDelete={handleStudentDelete}
          onEdit={(item) => handleStudentEdit(item as unknown as FlattenedStudent)}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          totalCount={totalCount}
        />
        <DialogRoot open={isDialogOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
          <DialogContent>
            <DialogHeader>{editingStudent ? t('edit_student') : t('add_new_student')}</DialogHeader>
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
                    required={true}
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
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field.Root>
                {!editingStudent && (
                  <>
                    <Field.Root required>
                      <Field.Label>
                        {t('password')}<Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="password"
                        placeholder={t('password')}
                        name="password"
                        value={password}
                        required={true}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root required>
                      <Field.Label>
                        {t('confirm_password')}<Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="password"
                        placeholder={t('confirm_password')}
                        name="confirmPassword"
                        value={confirmPassword}
                        required={true}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Field.Root>
                  </>
                )}
                <Box>
                  <Text>{t('grade_level')}</Text>
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
                {t('save')}
              </Button>
              <Button variant="outline" bgColor={"red.300"} onClick={onClose}>
                {t('cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
    </>
  );
};

export default Students;