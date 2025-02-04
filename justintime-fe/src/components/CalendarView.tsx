import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";

// Define lesson structure
interface Lesson {
  id: string;
  teacher: string;
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
  { id: "1", teacher: "Elena Studenkova", subject: "", start: getDateForThisWeek(1, 10), end: getDateForThisWeek(1, 11) }, // Monday
  { id: "2", teacher: "Oleg Novikov", subject: "", start: getDateForThisWeek(3, 14), end: getDateForThisWeek(3, 15) }, // Wednesday
];

const CalendarView: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

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

      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        editable={true} // Enables drag & drop
        timeZone="local" // Ensures correct local time
        slotMinTime={"08:00:00"} // Start time
        slotMaxTime={"18:00:00"} // End time
        weekends={false} // Hide weekends
        events={lessons.map((lesson) => ({
          id: lesson.id,
          title: `${lesson.subject} (${lesson.teacher})`,
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