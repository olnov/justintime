import { Box, Button, Flex, Heading, Input, VStack, Text } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const mockUser = {
        fullName: "Oleg Novikov",
        email: "o.novikov@ymail.com",
        password: "password!1",
        role: "global_admin",
    }

    const handleLogin = () => {
        if (email === mockUser.email && password === mockUser.password) {
            localStorage.setItem("userName", mockUser.fullName);
            localStorage.setItem("userRole", mockUser.role);
            navigate("/dashboard");
            console.log("Logged in!");
        } else {
            toaster.create({
                title: "Invalid credentials!",
                description: "Please check your email and password and try again.",
                type: "error",
              });
            console.log("Invalid credentials!");
        }
    };

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