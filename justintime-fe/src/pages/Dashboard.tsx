import { Box, Heading, Card, Button, HStack, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { getSchools } from "@/services/SchoolService";
import { getUsers } from "@/services/UserService";
import { getTeachers } from "@/services/TeacherService";
import { useState, useEffect } from "react";

const Dashboard = () => {
    const [schools, setSchools] = useState<unknown[]>([]);
    const [users, setUsers] = useState<unknown[]>([]);
    const [teachers, setTeachers] = useState<unknown[]>([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchSchools();
        fetchUsers();
        fetchTeachers();
    }, []);

    const fetchSchools = async () => {
        if (token) {
            const data = await getSchools(token);
            setSchools(data);
        } else {
            throw new Error("You are not authenticated");
        }
    };

    const fetchUsers = async () => {
        if (token) {
            const data = await getUsers(token);
            setUsers(data);
        } else {
            throw new Error("You are not authenticated");
        }
    };

    const fetchTeachers = async () => {
        if (token) {
            const data = await getTeachers(token);
            setTeachers(data);
        } else {
            throw new Error("You are not authenticated");
        }
    }

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
                            <Text fontSize="3xl">{schools.length}</Text>
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
                            <Text fontSize="3xl">{users.length}</Text>
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
                            <Text fontSize="3xl">{teachers.length}</Text>
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