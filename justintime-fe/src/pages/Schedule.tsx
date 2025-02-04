import { Heading } from "@chakra-ui/react";
import {Grid, Box, Text} from "@chakra-ui/react";
import ListView from "@/components/ListView";
import TimelineView from "@/components/TimeLineView";
import CardView from "@/components/CardView";
import CalendarView from "@/components/CalendarView";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

const WeeklyCalendar = () => (
    <Grid templateColumns="repeat(8, 1fr)" gap={1}>
        <Box></Box>
        {days.map(day => <Box key={day} p={2} bg="gray.100"><Text fontWeight="bold">{day}</Text></Box>)}
        {times.map(time => (
            <>
                <Box p={2} bg="gray.50"><Text>{time}</Text></Box>
                {days.map(day => <Box key={`${day}-${time}`} p={2} border="1px" borderColor="gray.200"></Box>)}
            </>
        ))}
    </Grid>
);

const Schedule = () => {
    return (
        <>
            {/* <WeeklyCalendar /> */}
            {/* <ListView /> */}
            {/* <TimelineView /> */}
            {/* <CardView /> */}
            <CalendarView />
        </>
    );
}

export default Schedule;