import { parseToken } from "@/services/AuthService";
import {
    Box,
    Avatar,
    Heading,
    Text,
    VStack,
    Separator,
    Button,
    Flex,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

const TeacherProfile = () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "Student Name";
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        getUserInfo();
    }, []);

    function getUserInfo() {
        if (token) {
            const userInfo = parseToken(token);
            const email = userInfo.email || null;
            setEmail(email);
        } else {
            throw new Error("You are not authenticated");
        }
    }

    return (
        <Flex
            // minH="100vh"
            align="center"
            justify="center"
        // bg="gray.50"
        // py={10}
        // px={4}
        >
            <Box
                maxW="xl"
                w="full"
                bg="white"
                boxShadow="xs"
                borderRadius="xs"
                p={4}
                textAlign="center"
            >
                <VStack>
                    <Avatar.Root shape="rounded" size="sm">
                        <Avatar.Fallback name={userName} />
                    </Avatar.Root>
                    <Heading fontSize="2xl">{userName}</Heading>
                    <Text color="gray.500">{email!}</Text>
                </VStack>

                <Separator />

                <VStack align="start">
                    <Heading fontSize="lg">Change password</Heading>
                    <Button variant="outline" colorScheme="blue" size="sm">
                        Change password
                    </Button>

                    <Separator />

                    <Heading fontSize="lg">Lessons completed this week</Heading>
                    <Text color="gray.600">I've completed 5 lessons so far</Text>
                    
                    <Separator />

                    <Heading fontSize="lg">Completed lessons report</Heading>
                    <Text color="gray.600">Select reporting period</Text>
                    <Button variant="outline" colorScheme="blue" size="sm">
                        Download report
                    </Button>

                </VStack>
            </Box>
        </Flex>
    );
};

export default TeacherProfile;
