import { Box, Button, Flex, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { login, isAuthenticated } from "@/services/AuthService";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    });

    const handleLogin = async () => {
        try {
            const loggedInUser = await login(email, password);
            localStorage.setItem("userName", loggedInUser.user.username);
            localStorage.setItem("token", loggedInUser.accessToken);
            navigate("/dashboard");
        } catch (error) {
            toaster.create({
                title: "Authentication error",
                description: error instanceof Error ? error.message : "An unknown error occurred",   
                type: "error",
            });
        }
    }

    return (
        <Flex
            minH="100vh"
            minW="100vw"
            align="center"
            justify="center"
            bgImage="url('/src/assets/bg-image.jpg')"
            bgPos="center"
            bgRepeat="no-repeat"
            bgSize="cover"
            position="fixed"
            top="0"
            left="0"
        >

            <VStack
                mx="auto"
                maxW="lg"
                py={12}
                px={6}
                position="relative"
                zIndex={2}
            >
                <Box rounded="lg" bg="rgba(255, 255, 255, 0.95)" boxShadow="lg" p={8}>
                    <VStack align="center">
                        <Heading fontSize="xl" color="gray">Sign in to your account</Heading>
                    </VStack>
                    <VStack h={220} width={300}>
                        <Box>
                            <Text>Email address</Text>
                            <Input
                                type="email"
                                width={250}
                                name="email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Box>
                        <Box>
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
                        <VStack h={10}>
                            <Button
                                bg="blue.400"
                                color="white"
                                _hover={{
                                    bg: "blue.500",
                                }}
                                onClick={handleLogin}
                            >
                                Sign in
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            </VStack>
        </Flex>
    );
};

export default Login;