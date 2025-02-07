import React, { useState, useEffect } from "react";
import { Box, Text, createListCollection } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { getTeacherBySchoolId } from "@/services/TeacherService";
import { parseToken } from "@/services/AuthService";

// Define lesson structure
interface Lesson {
  id: string;
  student: string;
  subject: string;
  start: Date;
  end: Date;
}

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

// Sample lessons (now dynamically aligned to the current week)
const initialLessons: Lesson[] = [
  { id: "1", student: "Elena Studenkova", subject: "", start: getDateForThisWeek(1, 10), end: getDateForThisWeek(1, 11) }, // Monday
  { id: "2", student: "Oleg Novikov", subject: "", start: getDateForThisWeek(3, 14), end: getDateForThisWeek(3, 15) }, // Wednesday
];

// Teacher's sample list
// const teachers = createListCollection({
//   items: [
//     { label: "Margarita Abaimova", value: "1" },
//     { label: "Natalia Neviditsyna", value: "2" },
//   ],
// })

const CalendarView: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [teachers, setTeachers] = useState(createListCollection({ items: [] }));

  useEffect(() => {
    fetchTeachers();
  }, []);

  console.log("Teachers:",teachers);

  // Getting teachers list by SchoolID
  const fetchTeachers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Here!!!!");
      const schoolId = parseToken(token).schools[0].id;
      const data = await getTeacherBySchoolId(token, schoolId);
      const teacherList = data.map((teacher: any) => ({
        label: teacher.userSchool.user.name,
        value: teacher.id,
      }));

      setTeachers(createListCollection({ items: teacherList }));
      console.log("Teachers from Data:",data.map((teacher: any) => ({ label: teacher.userSchool.user.name, value: teacher.id })));
    } else {
      throw new Error("You are not authenticated");
    }
  };

  // Handle event drop (drag & drop functionality)
  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === eventDropInfo.event.id
          ? { ...lesson, start: new Date(eventDropInfo.event.startStr), end: new Date(eventDropInfo.event.endStr) }
          : lesson
      )
    );
  };

  // Handle event click (could be used for editing)
  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(`Editing: ${clickInfo.event.title}`);
  };

  return (
    <Box p={5} bg="white" boxShadow="md" borderRadius="lg" width={["100%", "100%", "120%"]} mx={[-5, -5, "-10%"]}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Teacher's Weekly Schedule
      </Text>
      <SelectRoot collection={teachers} key={teachers.items[0].value} size={"xs"} mb={4}>
        <SelectTrigger>
          <SelectValueText placeholder="Select teacher" />
        </SelectTrigger>
        <SelectContent>
          {teachers.items.map((teacher) => (
            <SelectItem item={teacher} key={teacher.value}>
              <SelectLabel>{teacher.label}</SelectLabel>
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        themeSystem="standard"
        stickyHeaderDates={true}
        initialView="timeGridWeek"
        editable={true} // Enables drag & drop
        timeZone="local" // Ensures correct local time
        slotMinTime={"08:00:00"} // Start time
        slotMaxTime={"18:00:00"} // End time
        weekends={false} // Hide weekends
        events={lessons.map((lesson) => ({
          id: lesson.id,
          title: `${lesson.subject} (${lesson.student})`,
          start: lesson.start.toISOString(), // FullCalendar requires ISO format
          end: lesson.end.toISOString(),
        }))}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        height="auto"
      />
    </Box>
  );
};

export default CalendarView;