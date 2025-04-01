import { Box, Heading, Text, Button, Center } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Center h="100vh" bg="gray.50">
      <Box textAlign="center" p={6} rounded="md" bg="white" boxShadow="md">
        <Heading fontSize="4xl" mb={4}>
          403
        </Heading>
        <Text fontSize="xl" mb={6}>
          You do not have permission to access this page.
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>
    </Center>
  );
};

export default AccessDenied;