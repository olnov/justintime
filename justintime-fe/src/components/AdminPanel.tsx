import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminPanel = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Flex flex="1" mt="64px"> {/* Adjusted to account for the fixed navbar height */}
        <Sidebar />
        <Box as="main" flex="1" p={4} ml="200px">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminPanel;