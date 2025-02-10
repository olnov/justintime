import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Text,
    Button,
    Input,
    createListCollection,
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

// Sample lessons (dynamically aligned to the current week)
const initialLessons: Lesson[] = [
    {
        id: "1",
        student: "Elena Studenkova",
        subject: "Math",
        start: getDateForThisWeek(1, 10),
        end: getDateForThisWeek(1, 11),
    }, // Monday
    {
        id: "2",
        student: "Oleg Novikov",
        subject: "Science",
        start: getDateForThisWeek(3, 14),
        end: getDateForThisWeek(3, 15),
    }, // Wednesday
];

const CalendarView: React.FC = () => {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons); // State for lessons
    const [teachers, setTeachers] = useState(createListCollection<{ label: string; value: string }>({ items: [] })); // State for teachers
    const [selectedTeacher, setSelectedTeacher] = useState<string>("");
    const contentRef = useRef<HTMLDivElement>(null)

    const [formData, setFormData] = useState({
        student: "",
        subject: "",
        start: new Date(),
        end: new Date(),
        teacher: "",
    });

    // A custom state for the dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch teachers list by SchoolID
    const fetchTeachers = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const schoolId = parseToken(token).schools[0].id;
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

    useEffect(() => {
        fetchTeachers();
    }, []);


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
        // Set default teacher to the one selected in the filter (if available)
        const defaultTeacher = selectedTeacher || "";
        // Pre-fill the form with the selected time slot
        setFormData({
            student: "",
            subject: "",
            start: selectInfo.start,
            end: selectInfo.end,
            teacher: defaultTeacher,
        });
        setIsDialogOpen(true);
    };

    // Handle form submission from the dialog
    const handleFormSubmit = () => {
        // Create a new lesson (for a real app, you might use a more robust ID generator)
        const newLesson: Lesson = {
            id: (lessons.length + 1).toString(),
            student: formData.student,
            subject: formData.subject,
            start: formData.start,
            end: formData.end,
        };

        setLessons((prev) => [...prev, newLesson]);
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

    // Handle teacher selection from the filter (using your custom Select)
    const handleFilterTeacherChange = (teacherValue: string) => {
        setSelectedTeacher(teacherValue);
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
                        <SelectItem item={teacher} key={teacher.value} onClick={() => handleFilterTeacherChange(teacher.value)}>
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
                editable={true} // Enables drag & drop
                selectable={true} // Enables selection of time slots
                select={handleDateSelect} // Called when an empty slot is clicked
                timeZone="local" // Ensures correct local time
                slotMinTime="08:00:00" // Start time
                slotMaxTime="18:00:00" // End time
                weekends={false} // Hide weekends
                allDaySlot={false} // Hide all-day slot
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

            {/* Dialog for booking a lesson */}
            <>
                <DialogRoot open={isDialogOpen} onOpenChange={(open) => { if (!open) { setIsDialogOpen(false); } }}>
                    <DialogContent ref={contentRef}>
                        <DialogHeader>Book a Lesson</DialogHeader>
                        <DialogBody>
                            <Box mb={3}>
                                <label htmlFor="student">
                                    <Text mb={1}>Student Name</Text>
                                </label>
                                <Input
                                    id="student"
                                    name="student"
                                    value={formData.student}
                                    onChange={handleInputChange}
                                    placeholder="Enter student name"
                                />
                            </Box>
                            <Box mb={3}>
                                <label htmlFor="subject">
                                    <Text mb={1}>Subject</Text>
                                </label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Enter subject"
                                />
                            </Box>
                            <Box mb={3}>
                                <label htmlFor="start">
                                    <Text mb={1}>Start Time</Text>
                                </label>
                                <Input
                                    id="start"
                                    type="datetime-local"
                                    name="start"
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
                                    size="xs"
                                    mb={4}
                                    // onChange={((item: { value: string; label: string }) => handleTeacherChange(item)) as unknown as React.FormEventHandler<HTMLDivElement>}
                                >
                                    <SelectTrigger bgColor={"white"}>
                                        <SelectValueText placeholder="Select teacher" />
                                    </SelectTrigger>
                                    <SelectContent portalRef={contentRef}>
                                        {teachers.items.map((teacher: { label: string; value: string }) => (
                                            <SelectItem item={teacher} key={teacher.value} onClick={()=> handleTeacherChange(teacher)}>
                                                <SelectLabel>{teacher.label}</SelectLabel>
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
            </>
        </Box>
    );
};

export default CalendarView;
