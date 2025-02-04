import { Flex, Box, Text } from "@chakra-ui/react";

const appointments = [
  { day: "Mon", start: "9:00", end: "10:00", student: "John Doe", instrument: "Piano" },
  { day: "Mon", start: "10:00", end: "11:00", student: "Jane Smith", instrument: "Violin" },
];

const TimelineView = () => (
  <Flex direction="column" gap={4}>
    {appointments.map((app, index) => (
      <Box key={index} p={2} bg="teal.50" borderRadius="md">
        <Text fontWeight="bold">{app.day}</Text>
        <Text>{app.start} - {app.end}</Text>
        <Text>{app.student} - {app.instrument}</Text>
      </Box>
    ))}
  </Flex>
);

export default TimelineView;