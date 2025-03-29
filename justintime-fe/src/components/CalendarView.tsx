import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  createListCollection,
  Badge,
  Spinner,
  List,
  Stack,
} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from '@fullcalendar/core/locales/ru';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { DateSelectArg, EventClickArg, EventDropArg } from "@fullcalendar/core";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster"
import { getTeacherBySchoolId, getTeacherByUserSchoolId } from "@/services/TeacherService";
import {
  getScheduleBySchoolId,
  getScheduleBySchooIdAndTeacherId,
  bookLesson,
  updateBooking,
  deleteLesson,
} from "@/services/ScheduleService";
import { getStudentBySchoolId } from "@/services/StudentService";
import { Lesson } from "@/types/lesson.types";
import { APILesson } from "@/types/transformation.types";
import { Teacher } from "@/types/teacher.types";
import { RawScheduleItem } from "@/types/schedule.types";
import { Student } from "@/types/student.types";
import { Email } from "@/types/email.types";
import { sendEmail } from "@/services/EmailNotificationService";
import { useTranslation } from "react-i18next";
import { parseToken } from "@/services/AuthService";
import { useNavigate } from "react-router-dom";
import { UserSchool } from "@/types/user.types";


const CalendarView: React.FC<{ schoolId: string }> = ({ schoolId }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [teachers, setTeachers] = useState(
    createListCollection<{ label: string; value: string }>({ items: [] })
  );
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedStudentInfo, setSelectedStudentInfo] = useState<{ id: string; name: string, email: string } | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  // A custom state for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  // RBAC management
  // const [teacherId, setTeacherId] = useState<string>("");

  const statusCollection = createListCollection({
    items: [
      { label: t('planning'), value: "planned" },
      { label: t('confirmed'), value: "scheduled" },
      { label: t('completed'), value: "completed" },
      { label: t('cancelled'), value: "cancelled" },
    ],
  });

  const [formData, setFormData] = useState({
    student: "",
    subject: "",
    start: new Date(),
    end: new Date(),
    teacher: "",
    status: "",
  });

  // Loading nessesary data on component mount 
  useEffect(() => {
    fetchTeachers();
    if (selectedStudent.length >= 3) {
      fetchStudents();
    } else {
      setStudents([]);
    }
    fetchAppointments();
  }, [selectedStudent, selectedTeacher, isDialogOpen]);

  // Check if user is authenticated. 
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    const userInfo = parseToken(token);
    const roles = userInfo.schools.flatMap((school: UserSchool) => school.roles);

    switch (roles[0]) {
      case "admin":
        fetchAppointments();
        fetchTeachers();
        fetchStudents();
        break;
      case "teacher":
        fetchTeacherByUserSchoolId().then((teacher) => {
          // setTeacherId(teacher.id); 
          setSelectedTeacher(teacher.id);
          fetchAppointmentsByTeacher(teacher.id); 
        });
        break;
      case "student":
        setSelectedStudent(userInfo.id);
        break;
      default:
        navigate("/login");
    }
  }, [token, navigate]);

  if (!token) return null;

  // TBD: Consider db schema refactoring.
  const fetchTeacherByUserSchoolId = async () => {
    const token = localStorage.getItem("token");
    const userInfo = parseToken(token!);
    const data = await getTeacherByUserSchoolId(token!, userInfo.schools[0].userSchoolId);
    return data;
  }


  // Fetching calendar data filtered by teacher and school
  const fetchAppointmentsByTeacher = async (teacherId: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = await getScheduleBySchooIdAndTeacherId(token, schoolId, teacherId);
      const transformedLessons: Lesson[] = data.map((item: RawScheduleItem) => ({
        id: item.id,
        teacher: {
          id: item.teacher?.id || "",
          name: item.teacher?.userSchool?.user?.name || "",
        },
        student: {
          id: item.student?.id || "",
          name: item.student?.userSchool?.user?.name || "",
        },
        subject: "Vocal", // TBD: Implement subject on the backend. Default subject is Vocal.
        start: new Date(item.startTime),
        end: new Date(item.endTime),
        status: item.status,
      }));
      setLessons(transformedLessons);
    } else {
      throw new Error("You are not authenticated");
    }
  }

  // Handle delete lesson dialog
  const handleDelete = (lessonId: string) => {
    setIsConfirmDeleteOpen(true);
    setDeletingLessonId(lessonId);
  }

  // Delete lesson
  const handleDeleteLesson = async () => {
    if (!deletingLessonId) throw new Error("No lesson ID provided");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You are not authenticated");
      }
      await deleteLesson(token, deletingLessonId);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== deletingLessonId));
      onClose();
      toaster.create({
        title: t('success'),
        description: t('lesson_deleted_successfully'),
        type: "success",
      });
    } catch {
      toaster.create({
        title: t('error'),
        description: t('failed_delete_lesson'),
        type: "error",
      });
    }
  }

  //Stroring lessons bookings
  const saveLessonBooking = async (lesson: APILesson) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("You are not authenticated");
    }
    try {
      await bookLesson(token, lesson);
      toaster.create({
        title: t('success'),
        description: t('lesson_booked_successfully'),
        type: "success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toaster.create({
          title: t('error'),
          description: error.message,
          type: "error",
        });
      }
      return;
    }
  };

  // Update lesson booking
  const updateLessonBooking = async (token: string, lessonId: string, lesson: APILesson) => {
    if (!token) {
      throw new Error("You are not authenticated");
    }
    try {
      await updateBooking(token, lessonId, lesson);
      toaster.create({
        title: t('success'),
        description: t('lesson_updated_successfully'),
        type: "success",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toaster.create({
          title: t('error'),
          description: error.message,
          type: "error",
        });
      }
      return;
    }
  };


  // Fetch teachers list by SchoolID. SchoolID is passed as a prop
  const fetchTeachers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = await getTeacherBySchoolId(token, schoolId);
      const teacherList = data.data.map((teacher: Teacher) => ({
        label: teacher.userSchool?.user?.name,
        value: teacher.id,
      }));
      setTeachers(createListCollection({ items: teacherList }));
    } else {
      throw new Error("You are not authenticated");
    }
  };

  // Fetching all students by SchoolId
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      const data = await getStudentBySchoolId(token, schoolId);
      const filteredStudentList = data.data.filter((student: Student) => {
        const studentName = student.userSchool?.user?.name ?? "";
        return studentName.toLowerCase().includes(selectedStudent.toLowerCase());
      });
      setStudents(filteredStudentList);
      setLoading(false);
    } else {
      throw new Error("You are not authenticated");
    }
  };

  // Fetching all appointments for the School
  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = await getScheduleBySchoolId(token, schoolId);
      const transformedLessons: Lesson[] = data.map((item: RawScheduleItem) => ({
        id: item.id,
        teacher: {
          id: item.teacher?.id || "",
          name: item.teacher?.userSchool?.user?.name || "",
        },
        student: {
          id: item.student?.id || "",
          name: item.student?.userSchool?.user?.name || "",
        },
        subject: "Vocal", // TBC: Implement subject on the backend. Default subject is Vocal.
        start: new Date(item.startTime),
        end: new Date(item.endTime),
        status: item.status,
      }));

      const filteredLessons = transformedLessons.filter((lesson) => {
        return selectedTeacher === "" || lesson.teacher.id === selectedTeacher;
      });

      // setLessons(transformedLessons);
      setLessons(filteredLessons);
    } else {
      throw new Error("You are not authenticated");
    }
  };

  // Handle event drop (drag & drop functionality)
  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === eventDropInfo.event.id
          ? {
            ...lesson,
            start: new Date(eventDropInfo.event.startStr),
            end: new Date(eventDropInfo.event.endStr),
          }
          : lesson
      )
    );
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;

    setFormData({
      student: event.extendedProps.studentId,
      subject: event.title,
      start: new Date(event.startStr),
      end: new Date(event.endStr),
      teacher: event.extendedProps.teacherId,
      status: event.extendedProps.status,
    });

    setSelectedStudent(event.extendedProps.student);
    setSelectedStudentInfo({
      id: event.extendedProps.studentId,
      name: event.extendedProps.student,
      email: event.extendedProps.studentEmail,
    });

    setEditingLessonId(event.id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Handle selection of an empty time slot on the calendar
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const defaultTeacher = selectedTeacher || "";
    const startTime = selectInfo.start;
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    setFormData({
      student: "",
      subject: "",
      start: startTime,
      end: endTime,
      teacher: defaultTeacher,
      status: "",
    });
    setIsDialogOpen(true);
  };

  // Handle form submission from the dialog
  const handleFormSubmit = async () => {
    const formattedStart = formData.start.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const formattedEnd = formData.end.toISOString().replace(/\.\d{3}Z$/, 'Z');

    const teacherInfo = teachers.items.find(t => t.value === formData.teacher);

    const updatedLesson: Lesson = {
      id: editingLessonId || (lessons.length + 1).toString(),
      teacher: {
        id: formData.teacher,
        name: teacherInfo?.label || "",
      },
      student: {
        id: formData.student,
        name: selectedStudentInfo?.name || "",
        email: selectedStudentInfo?.email || "",
      },
      school: schoolId,
      subject: formData.subject,
      start: new Date(formattedStart),
      end: new Date(formattedEnd),
      status: formData.status,
    };

    if (!formData.student || !formData.teacher || !formData.status) {
      toaster.create({
        title: t('error'),
        description: t('fill_all_fields'),
        type: "error",
      });
      return;
    }

    if (!updatedLesson.student.id?.trim() || !updatedLesson.teacher.id?.trim()) {
      toaster.create({
        title: t('error'),
        description: t('student_or_teacher_undefined'),
        type: "error",
      });
      return;
    }

    if (formData.start >= formData.end) {
      toaster.create({
        title: t('error'),
        description: t('start_must_be_before_end'),
        type: "error",
      });
      return;
    }

    const apiLesson: APILesson = {
      id: updatedLesson.id,
      teacherId: updatedLesson.teacher.id,
      studentId: updatedLesson.student.id,
      schoolId: updatedLesson.school,
      startTime: updatedLesson.start,
      endTime: updatedLesson.end,
      status: updatedLesson.status,
    };

    if (isEditing && editingLessonId) {
      await updateLessonBooking(localStorage.getItem("token")!, editingLessonId, apiLesson);

      // Check if status has changed
      const originalLesson = lessons.find(lesson => lesson.id === editingLessonId);
      const statusChanged = originalLesson && originalLesson.status !== formData.status;

      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson.id === editingLessonId ? updatedLesson : lesson
        )
      );

      // Send notification if status changed
      if (statusChanged) {
        const notification: Email = {
          from: "Support Novlab <support@novlab.org>",
          to: updatedLesson.student.email,
          subject: "Class status updated",
          html: `<p>Dear ${updatedLesson.student.name},<br>Your class status with ${updatedLesson.teacher.name} has been updated to <b>${updatedLesson.status}</b>.<br>
          Class details: ${updatedLesson.start.toLocaleDateString()} ${updatedLesson.start.toLocaleTimeString()} - ${updatedLesson.end.toLocaleTimeString()}<br>Best regards,<br>Novlab Support</p>`
        };

        sendEmail(localStorage.getItem("token")!, notification);
      }

    } else {
      // New booking scenario
      await saveLessonBooking(apiLesson);
      setLessons(prev => [...prev, updatedLesson]);

      const notification: Email = {
        from: "Support Novlab <support@novlab.org>",
        to: updatedLesson.student.email,
        subject: "Class booking notification",
        html: `<p>Dear ${updatedLesson.student.name}, <br>Your class with ${updatedLesson.teacher.name} has been booked successfully.<br>
        Date and time: <b>${updatedLesson.start.toLocaleDateString()} ${updatedLesson.start.toLocaleTimeString()} - ${updatedLesson.end.toLocaleTimeString()}</b><br>Best regards,<br>Novlab Support</p>`
      };

      sendEmail(localStorage.getItem("token")!, notification);
    }

    setIsDialogOpen(false);
    setIsEditing(false);
    setEditingLessonId(null);
  };

  // Handle teacher selection in the dialog form
  const handleTeacherChange = (item: { value: string; label: string }) => {
    setFormData((prev) => ({
      ...prev,
      teacher: item.value,
    }));
  };

  // Handle teacher selection from the filter
  const handleFilterTeacherChange = (teacherValue: string) => {
    setSelectedTeacher(teacherValue);
    fetchAppointmentsByTeacher(teacherValue);
  };

  // Reset the filter
  const handleFilterReset = () => {
    setSelectedTeacher("");
    fetchAppointments();
  };

  // Close the dialog
  const onClose = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedStudent("");
    setFormData({
      student: "",
      subject: "",
      start: new Date(),
      end: new Date(),
      teacher: "",
      status: "",
    });
    setIsConfirmDeleteOpen(false);
    setDeletingLessonId(null);
  };

  // Handle changes of status in form
  const handleStatusChange = (item: { value: string; label: string }) => {
    setFormData((prev) => ({
      ...prev,
      status: item.value,
    }));
  };

  // Handle selecting a student from the suggestions list
  const handleSelectStudent = (student: Student) => {
    const studentName = student.userSchool?.user?.name || "";
    setSelectedStudent(studentName);
    setSelectedStudentInfo({ id: student.id, name: studentName, email: student.userSchool?.user?.email || "" }); // store full info. TBC: candidate for refactioring
    setFormData((prev) => ({
      ...prev,
      student: student.id,
    }));
    setStudents([]);
  };

  const userInfo = parseToken(token);
  console.log(userInfo);
  const roles = userInfo.schools.flatMap((school: UserSchool) => school.roles);
  return (
    <>
      <Box
        p={5}
        bg="white"
        boxShadow="md"
        borderRadius="lg"
        // width={"85%"}
        alignItems={"center"}
        alignContent={"center"}
        textAlign={"center"}
        width={["85%", "85%", "95%"]}
        mx={[0, 0, "2%"]}
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          {t('weekly_schedule_title')}
        </Text>
        <Stack direction={"row"} h={10} mb={4} align={"flex-start"}>
          {/* Teacher Filter for admin only */}
          {roles[0] === "admin" && (
            <>
          <SelectRoot
            collection={teachers}
            key={teachers.items.length ? teachers.items[0].value : "empty"}
            value={selectedTeacher ? [selectedTeacher] : []}
            size="sm"
            mb={4}
          >
            <SelectTrigger>
              <SelectValueText placeholder={t('select_teacher')} />
            </SelectTrigger>
            <SelectContent>
              {teachers.items.map((teacher: { label: string; value: string }) => (
                <SelectItem
                  item={teacher}
                  key={teacher.value}
                  onClick={() => handleFilterTeacherChange(teacher.value)}
                >
                  <SelectLabel>{teacher.label}</SelectLabel>
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <Button onClick={() => handleFilterReset()} size={"sm"} bgColor={"blue.500"}>{t('reset')}</Button>
          </>
          )} 
          {/* Delete lesson button */}
        </Stack>

        {/* FullCalendar Component */}
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          locale={localStorage.getItem("language") === "ru" ? ruLocale : enLocale}
          themeSystem="standard"
          stickyHeaderDates={true}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          select={handleDateSelect}
          timeZone="local"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          weekends={true}
          allDaySlot={false}
          events={lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.subject,
            start: lesson.start.toISOString(),
            end: lesson.end.toISOString(),
            extendedProps: {
              student: lesson.student.name,
              studentId: lesson.student.id,
              studentEmail: lesson.student.email,
              teacherId: lesson.teacher.id,
              teacher: lesson.teacher.name,
              status: lesson.status,
            },
          }))}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          height="auto"
          eventContent={(arg) => {
            const timeText = arg.timeText;
            const status = arg.event.extendedProps.status;
            // const subject = arg.event.title;
            const student = arg.event.extendedProps.student;
            const teacher = arg.event.extendedProps.teacher;
            return (
              <div
                style={{
                  fontSize: "0.7em",
                  whiteSpace: "normal",
                  lineHeight: "1.2",
                  padding: "2px",
                }}
              >
                {timeText && (
                  <div style={{ fontWeight: "normal", marginBottom: "0.2em" }}>
                    <Badge variant={"solid"} size={"xs"}>
                      {timeText}
                    </Badge>
                    {status === "planned" && (
                      <Badge variant={"surface"} size={"xs"} ml={2} colorPalette={"accent"}>
                        {status}
                      </Badge>
                    )}
                    {status === "scheduled" && (
                      <Badge variant={"surface"} size={"xs"} ml={2} colorPalette={"orange"}>
                        {status}
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge variant={"surface"} size={"xs"} ml={2} colorPalette={"green"}>
                        {status}
                      </Badge>
                    )}
                    {status === "cancelled" && (
                      <Badge variant={"surface"} size={"xs"} ml={2} colorPalette={"red"}>
                        {status}
                      </Badge>
                    )}
                  </div>
                )}
                <div>
                  <span style={{ fontWeight: "bold" }}>{t('student')}: </span>
                  <span style={{ fontStyle: "italic" }}>{student}</span>
                </div>
                <div>
                  <span style={{ fontWeight: "bold" }}>{t('teacher')}: </span>
                  <span style={{ fontStyle: "italic" }}>{teacher}</span>
                </div>
                <br />
              </div>
            );
          }}
        />

        {/* Dialog for booking a lesson */}
        <DialogRoot
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsDialogOpen(false);
            }
          }}
        >
          <DialogContent ref={contentRef}>
            <DialogHeader>{t('book_lesson')}</DialogHeader>
            <DialogBody>
              <Box mb={3} position="relative">
                <label htmlFor="student">
                  <Text mb={1}>{t('student_name')}</Text>
                </label>
                <Input
                  id="student"
                  name="student"
                  value={selectedStudent}
                  autoComplete="off"
                  onChange={(e) => {
                    setSelectedStudent(e.target.value);
                  }}
                  placeholder={t('start_input_student')}
                />
                {(selectedStudent?.length ?? 0) >= 3 && (students?.length ?? 0) > 0 && (
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
                    ) : students.length > 0 ? (
                      <List.Root variant={"plain"}>
                        {students.map((student: Student) => (
                          <List.Item
                            key={student.id}
                            p="2"
                            _hover={{ bg: "gray.100", cursor: "pointer" }}
                            fontStyle={"italic"}
                            color={"gray.600"}
                            bgColor={"yellow.100"}
                            onClick={() => handleSelectStudent(student)}
                          >
                            {student.userSchool?.user?.name || "N/A"}
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
              <Box mb={3}>
                <label htmlFor="start">
                  <Text mb={1}>{t('start_time')}</Text>
                </label>
                <Input
                  id="start"
                  type="datetime-local"
                  name="start"
                  required={true}
                  value={formData.start.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      start: new Date(e.target.value),
                    }))
                  }
                />
              </Box>
              <Box mb={3}>
                <label htmlFor="end">
                  <Text mb={1}>{t('end_time')}</Text>
                </label>
                <Input
                  id="end"
                  type="datetime-local"
                  name="end"
                  required={true}
                  value={formData.end.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      end: new Date(e.target.value),
                    }))
                  }
                />
              </Box>
              <Box mb={3}>
                <label htmlFor="teacher">
                  <Text mb={1}>{t('teacher')}</Text>
                </label>
                <SelectRoot
                  collection={teachers}
                  key={teachers.items.length ? teachers.items[0].value : "empty"}
                  value={[formData.teacher]}
                  disabled={roles[0] === 'teacher'}
                  required={true}
                  mb={4}
                >
                  <SelectTrigger bgColor={"white"}>
                    <SelectValueText placeholder={t('select_teacher')} />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef}>
                    {teachers.items.map((teacher: { label: string; value: string }) => (
                      <SelectItem
                        item={teacher}
                        key={teacher.value}
                        onClick={() => handleTeacherChange(teacher)}
                      >
                        <SelectLabel>{teacher.label}</SelectLabel>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Box>
              <Box mb={3}>
                <label htmlFor="status">
                  <Text mb={1}>{t('status')}</Text>
                </label>
                <SelectRoot
                  collection={statusCollection}
                  key={statusCollection.items.length ? statusCollection.items[0].value : "empty"}
                  value={[formData.status]}
                  disabled={roles[0] === 'srtudent'}
                  required={true}
                >
                  <SelectTrigger>
                    <SelectValueText placeholder={t('select_status')} />
                  </SelectTrigger>
                  <SelectContent portalRef={contentRef}>
                    {statusCollection.items.map((status) => (
                      <SelectItem item={status} key={status.value} onClick={() => handleStatusChange(status)}>
                        <SelectLabel>{status.label}</SelectLabel>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Box>
            </DialogBody>
            <DialogFooter>
              <Button variant={"outline"} bgColor="green.300" onClick={handleFormSubmit}>
                {t('save')}
              </Button>
              {isEditing && (
                <Button variant={"outline"} bgColor="orange.300" onClick={() => handleDelete(editingLessonId!)}>
                  {t('delete')}
                </Button>
              )}
              <Button variant="ghost" bgColor={"red.300"} onClick={onClose}>
                {t('cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
      <Box>
        <DialogRoot
          open={isConfirmDeleteOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsDialogOpen(false);
            }
          }}
        >
          <DialogContent ref={contentRef}>
            <DialogHeader>{t('delete_item')}</DialogHeader>
            <DialogBody>
              <Text>{t('delete_item_confirm')}</Text>
            </DialogBody>
            <DialogFooter>
              <Button variant={"outline"} bgColor="red.300" onClick={handleDeleteLesson}>
                {t('delete')}
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

export default CalendarView;
