import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react"; // ✅ Import Box and Flex from Chakra UI
import Sidebar from "./Sidebar"; // ✅ Import your sidebar component
import Navbar from "./Navbar";   // ✅ Import your top navbar component

const SchoolPanel = () => {
    
    return (
        <Flex direction="column" minH="100vh">
            <Navbar />
            <Flex flex="1" mt="64px"> {/* Adjusted to account for the fixed navbar height */}
                <Sidebar />
                <Box as="main" flex="1" p={4} ml="200px"> {/* Adjusted to account for the sidebar width */}
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    );
};

export default SchoolPanel;