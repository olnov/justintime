import { Box, Heading, Card, Button, HStack, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";

const Dashboard = () => {
    return (
        <>
        <Box p={4}>
            <Heading>Dashboard</Heading>
            <Box mt={4}>
                <HStack>
                <Card.Root width="320px">
                    <Card.Body gap="2">
                      <Card.Title mt="2">Total schools</Card.Title>
                        <Card.Description>
                            <Text fontSize="3xl">5</Text>
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="outline">Details</Button>
                    </Card.Footer>
                </Card.Root>
                <Card.Root width="320px">
                    <Card.Body gap="2">
                        <Card.Title mt="2">Total users</Card.Title>
                        <Card.Description>
                            <Text fontSize="3xl">10</Text>
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="outline">Details</Button>
                    </Card.Footer>
                </Card.Root>
                <Card.Root width="320px">
                    <Card.Body gap="2">
                        <Card.Title mt="2">Total teachers</Card.Title>
                        <Card.Description>
                            <Text fontSize="3xl">3</Text>
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="outline">Details</Button>
                    </Card.Footer>
                </Card.Root>
                </HStack>
            </Box>
        </Box>
        </>
    );
};

export default Dashboard;