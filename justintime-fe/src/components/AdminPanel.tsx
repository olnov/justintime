import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react"; 
import Sidebar from "./Sidebar"; 
import Navbar from "./Navbar";   

const AdminPanel = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Flex flex="1" mt="74px">
        <Sidebar />
        <Box as="main" flex="1" p={4} ml="200px">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminPanel;
