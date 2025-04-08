import {
    Box,
    Button,
    Flex,
    Heading,
    Input,
    VStack,
    Text,
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { login, isAuthenticated, parseToken } from "@/services/AuthService";
import { RawUser } from "@/types/user.types";
import bgImage from "@/assets/bg-image.jpg";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            const userInfo = parseToken(localStorage.getItem("token") as string);
            redirectUser(userInfo);
        }
    }, []);

    const redirectUser = (userInfo: RawUser) => {
        const isGlobalAdmin = userInfo.isGlobalAdmin;
        const schoolId = userInfo.schools?.[0]?.id;
        const userRoles = userInfo.schools?.flatMap((school: { roles: string[]; }) => school.roles) || [];

        if (isGlobalAdmin) {
            navigate("/admin/dashboard");
        } else if (
            schoolId &&
            (userRoles.includes("admin") || userRoles.includes("teacher"))
        ) {
            navigate(`/school/${schoolId}/dashboard`);
        } else if (schoolId && userRoles.includes("student")) {
            navigate(`/school/${schoolId}/student/dashboard`);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            toaster.create({
                title: "Missing credentials",
                description: "Please enter both email and password.",
                type: "error",
            });
            return;
        }

        try {
            const loggedInUser = await login(email, password);
            localStorage.setItem("userName", loggedInUser.user.username);
            localStorage.setItem("token", loggedInUser.accessToken);

            const userInfo = parseToken(loggedInUser.accessToken);
            // console.log("User info:", userInfo);
            redirectUser(userInfo);
        } catch (error) {
            toaster.create({
                title: "Authentication error",
                description:
                    error instanceof Error ? error.message : "An unknown error occurred",
                type: "error",
            });
        }
    };

    return (
        <Flex
            minH="100vh"
            minW="100vw"
            align="center"
            justify="center"
            bgImage={`url(${bgImage})`}
            bgPos="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            position="fixed"
            top="0"
            left="0"
        >
            <VStack mx="auto" maxW="lg" py={12} px={6} position="relative" zIndex={2}>
                <Box
                    rounded="lg"
                    bg="rgba(255, 255, 255, 0.95)"
                    boxShadow="lg"
                    p={8}
                    width="100%"
                >
                    <VStack align="center" mb={6}>
                        <Heading fontSize="xl" color="gray">
                            Sign in to your account
                        </Heading>
                    </VStack>
                    <VStack p={4} width="100%">
                        <Box width="100%">
                            <Text>Email address</Text>
                            <Input
                                type="email"
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Box>
                        <Box width="100%">
                            <Text>Password</Text>
                            <PasswordInput
                                name="password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleLogin();
                                    }
                                }}
                            />
                        </Box>
                        <Button
                            width="100%"
                            bg="blue.400"
                            color="white"
                            _hover={{ bg: "blue.500" }}
                            onClick={handleLogin}
                        >
                            Sign in
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Flex>
    );
};

export default Login;
