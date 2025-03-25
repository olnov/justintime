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
import { getTeacherBySchoolId } from "@/services/TeacherService";
import { getScheduleBySchoolId, getScheduleBySchooIdAndTeacherId } from "@/services/ScheduleService";
import { getStudentBySchoolId } from "@/services/StudentService";
import { bookLesson } from "@/services/ScheduleService";
import { Lesson } from "@/types/lesson.types";
import { APILesson } from "@/types/transformation.types";
import { Teacher } from "@/types/teacher.types";
import { RawScheduleItem } from "@/types/schedule.types";
import { Student } from "@/types/student.types";
import { Email } from "@/types/email.types";
import { sendEmail } from "@/services/EmailNotificationService";
import { useTranslation } from "react-i18next";


const CalendarView: React.FC<{ schoolId: string }> = ({ schoolId }) => {
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

  // A custom state for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetching calendar data filtered by teacher and school
  const fetchAppointmentsByTeacher = async (teacherId: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      const data = await getScheduleBySchooIdAndTeacherId(token, schoolId, teacherId);
      console.log("Data:", data);
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
      setLessons(transformedLessons);
    } else {
      throw new Error("You are not authenticated");
    }
  }


  //Stroring lessons bookings
  const saveLessonBooking = async (lesson: APILesson) => {
    const token = localStorage.getItem("token");
    if (token) {
      await bookLesson(token, lesson);
    } else {
      throw new Error("You are not authenticated");
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

  useEffect(() => {
    fetchTeachers();
    if (selectedStudent.length >= 3) {
      fetchStudents();
    } else {
      setStudents([]);
    }
    fetchAppointments();
  }, [selectedStudent, selectedTeacher]);

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

  // Handle event click (could be used for editing)
  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(`Editing: ${clickInfo.event.extendedProps.student}`);
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
  const handleFormSubmit = () => {

    const formattedStart = formData.start.toISOString().replace(/\.\d{3}Z$/, 'Z');
    const formattedEnd = formData.end.toISOString().replace(/\.\d{3}Z$/, 'Z');

    // Look up the teacher's name from your teacher list.
    const teacherInfo = teachers.items.find(
      (t: { label: string; value: string }) => t.value === formData.teacher
    );
    
    const newLesson: Lesson = {
      id: (lessons.length + 1).toString(),
      teacher: {
        id: formData.teacher,
        name: teacherInfo?.label || "",
      },
      student:{ 
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

    if (!formData.student || formData.student.trim() === "") {
        toaster.create({
            title: t('error'),
            description: t('no_such_student'),
            type: "warning",
          });
          return;
    }

    console.log("New lesson:", newLesson);
    if (newLesson.student?.id?.trim() === "" || !newLesson.teacher?.id?.trim() || newLesson.status.trim() === "") {
      toaster.create({
        title: t('error'),
        description: t('fill_all_fields'),
        type: "error",
      });
      return;
    }

    const convertedLesson:APILesson = {
        teacherId: newLesson.teacher.id,
        studentId: newLesson.student.id || "",
        schoolId: newLesson.school,
        startTime: newLesson.start,
        endTime: newLesson.end,
        status: newLesson.status,
    }

    setLessons((prev) => [...prev, newLesson]);
    saveLessonBooking(convertedLesson);
    // Sending notification

    const notification: Email = {
      from:"Support Novlab <support@novlab.org>",
      to: newLesson.student.email,
      subject:"Class booking notification",
      html:`<p>Dear ${newLesson.student.name}, <br> Your class with ${newLesson.teacher.name} has been booked successfully. 
      <br>Save the date: <b>${newLesson.start.toLocaleDateString()}: ${newLesson.start.toLocaleTimeString()} - ${newLesson.end.toLocaleTimeString()}</b><br> Best regards, <br> Novlab Support</p>`
    }
    sendEmail(localStorage.getItem("token") as string, notification);
    // console.log("Notification sent:", notification);
    setIsDialogOpen(false);
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

  return (
    <Box
      p={5}
      bg="white"
      boxShadow="md"
      borderRadius="lg"
      width={["100%", "100%", "120%"]}
      mx={[-5, -5, "-10%"]}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        {t('weekly_schedule_title')}
      </Text>
      <Stack direction={"row"} h={10} mb={4} align={"flex-start"}>
      {/* Teacher Filter */}
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
      <Button onClick={()=>handleFilterReset()} size={"sm"} bgColor={"blue.500"}>{t('reset')}</Button>
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
        weekends={false}
        allDaySlot={false}
        events={lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.subject,
          start: lesson.start.toISOString(),
          end: lesson.end.toISOString(),
          extendedProps: {
            student: lesson.student.name,
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
            <Button variant="ghost" bgColor={"red.300"} onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};

export default CalendarView;
