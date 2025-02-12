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
} from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DateSelectArg from "@fullcalendar/interaction";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
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
import { getScheduleBySchoolId } from "@/services/ScheduleService";
import { getStudentBySchoolId } from "@/services/StudentService";
import { bookLesson } from "@/services/ScheduleService";
import { Lesson } from "@/types/lesson.types";
import { APILesson } from "@/types/transformation.types";



// Helper function to get the current week's date
const getDateForThisWeek = (dayIndex: number, hour: number, minute: number = 0): Date => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = dayIndex - (currentDay === 0 ? 7 : currentDay); // Adjust for start of the week (Monday)
  const newDate = new Date(today);
  newDate.setDate(today.getDate() + diff);
  newDate.setHours(hour, minute, 0, 0);
  return newDate;
};

// Sample lessons (dynamically aligned to the current week)
// const initialLessons: Lesson[] = [
//   {
//     id: "1",
//     teacher: "Natalia Neveditsyna",
//     student: "Elena Studenkova",
//     subject: "Jazz Vocal",
//     start: getDateForThisWeek(1, 10),
//     end: getDateForThisWeek(1, 11),
//     status: "confirmed",
//   },
//   {
//     id: "2",
//     teacher: "Natalia Neveditsyna",
//     student: "Oleg Novikov",
//     subject: "Pop vocal",
//     start: getDateForThisWeek(3, 14),
//     end: getDateForThisWeek(3, 15),
//     status: "planned",
//   },
// ];

const statusCollection = createListCollection({
  items: [
    { label: "Planning", value: "planned" },
    { label: "Confirmed", value: "scheduled" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ],
});

const CalendarView: React.FC<{ schoolId: string }> = ({ schoolId }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [teachers, setTeachers] = useState(
    createListCollection<{ label: string; value: string }>({ items: [] })
  );
  const [status, setStatus] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
      const teacherList = data.map((teacher: any) => ({
        label: teacher.userSchool.user.name,
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
      const filteredStudentList = data.filter((student: any) => {
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
      const transformedLessons: Lesson[] = data.map((item: any) => ({
        id: item.id,
        teacher: item.teacher?.userSchool?.user?.name || "",
        student: item.student?.userSchool?.user?.name || "",
        subject: "Vocal", // TBC: Implement subject on the backend. Default subject is Vocal.
        start: new Date(item.startTime),
        end: new Date(item.endTime),
        status: item.status,
      }));
      setLessons(transformedLessons);
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
  }, [selectedStudent, isDialogOpen]);

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
    alert(`Editing: ${clickInfo.event.title}`);
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

    const newLesson: Lesson = {
      id: (lessons.length + 1).toString(),
      teacher: formData.teacher,
      student: formData.student,
      school: schoolId,
      subject: formData.subject,
      start: new Date(formattedStart),
      end: new Date(formattedEnd),
      status: formData.status,
    };

    if (!formData.student || formData.student.trim() === "") {
        toaster.create({
            title: "Validation error",
            description: "There is no such a student. Please select a student from the suggestion list.",
            type: "warning",
          });
          return;
    }

    console.log("New lesson:", newLesson);
    if (newLesson.student === "" || newLesson.teacher === "" || newLesson.status === "") {
      toaster.create({
        title: "Validation error",
        description: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    const convertedLesson:APILesson = {
        teacherId: newLesson.teacher,
        studentId: newLesson.student,
        schoolId: newLesson.school,
        startTime: newLesson.start,
        endTime: newLesson.end,
        status: newLesson.status,
    }

    setLessons((prev) => [...prev, newLesson]);
    saveLessonBooking(convertedLesson);
    setIsDialogOpen(false);
  };

  // Handle changes in the dialog form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  };

  // Handle changes of status in form
  const handleStatusChange = (item: { value: string; label: string }) => {
    setFormData((prev) => ({
      ...prev,
      status: item.value,
    }));
  };

  // Handle selecting a student from the suggestions list
  const handleSelectStudent = (student: any) => {
    const studentName = student.userSchool?.user?.name || "";
    setSelectedStudent(studentName);
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
        Teacher's Weekly Schedule
      </Text>
      {/* Teacher Filter */}
      <SelectRoot
        collection={teachers}
        key={teachers.items.length ? teachers.items[0].value : "empty"}
        size="xs"
        mb={4}
      >
        <SelectTrigger>
          <SelectValueText placeholder="Select teacher" />
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

      {/* FullCalendar Component */}
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
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
            student: lesson.student,
            teacher: lesson.teacher,
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
          const subject = arg.event.title;
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
                <span style={{ fontWeight: "bold" }}>Student: </span>
                <span style={{ fontStyle: "italic" }}>{student}</span>
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>Teacher: </span>
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
          <DialogHeader>Book a Lesson</DialogHeader>
          <DialogBody>
            <Box mb={3} position="relative">
              <label htmlFor="student">
                <Text mb={1}>Student Name</Text>
              </label>
              <Input
                id="student"
                name="student"
                value={selectedStudent}
                autoComplete="off"
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                //   setFormData((prev) => ({ ...prev, student: e.target.value }));
                }}
                placeholder="Start typing student name and it will show suggestions"
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
                      {students.map((student) => (
                        <List.Item
                          key={student.id}
                          p="2"
                          _hover={{ bg: "gray.100", cursor: "pointer" }}
                          onClick={() => handleSelectStudent(student)}
                        >
                          {student.userSchool?.user?.name || student.name}
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
                <Text mb={1}>Start Time</Text>
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
                <Text mb={1}>End Time</Text>
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
                <Text mb={1}>Teacher</Text>
              </label>
              <SelectRoot
                collection={teachers}
                key={teachers.items.length ? teachers.items[0].value : "empty"}
                value={[formData.teacher]}
                required={true}
                size="xs"
                mb={4}
              >
                <SelectTrigger bgColor={"white"}>
                  <SelectValueText placeholder="Select teacher" />
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
                <Text mb={1}>Status</Text>
              </label>
              <SelectRoot
                collection={statusCollection}
                size="xs"
                key={statusCollection.items.length ? statusCollection.items[0].value : "empty"}
                required={true}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select status" />
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
              Save
            </Button>
            <Button variant="ghost" bgColor={"red.300"} onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
};

export default CalendarView;
