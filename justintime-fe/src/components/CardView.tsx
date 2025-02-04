import { SimpleGrid, Text, Card } from "@chakra-ui/react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CardView = () => (
  <SimpleGrid columns={3} spacing={4}>
    {days.map(day => (
      <Card.Root key={day}>
        <Card.Header>
          <Text fontWeight="bold">{day}</Text>
        </Card.Header>
        <Card.Body>
          <Text>9:00 - Piano with John Doe</Text>
          <Text>10:00 - Violin with Jane Smith</Text>
        </Card.Body>
      </Card.Root>
    ))}
  </SimpleGrid>
);

export default CardView;