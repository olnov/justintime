import { Box, Text, List } from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
  } from "@/components/ui/accordion"


const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ListView = () => (
  <AccordionRoot>
    {days.map(day => (
      <AccordionItem key={day} value={day}>
        <AccordionItemTrigger>
          <Box flex="1" textAlign="left">
            <Text fontWeight="bold">{day}</Text>
          </Box>
        </AccordionItemTrigger>
        <AccordionItemContent>
          <List.Root spacing={3}>
            <List.Item p={2} bg="gray.50">9:00 - Piano with John Doe</List.Item>
            <List.Item p={2} bg="gray.50">10:00 - Violin with Jane Smith</List.Item>
          </List.Root>
        </AccordionItemContent>
      </AccordionItem>
    ))}
  </AccordionRoot>
);

export default ListView;