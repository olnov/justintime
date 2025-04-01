import { Outlet } from "react-router-dom";
import { Box, Flex, } from "@chakra-ui/react"; 
import Sidebar from "./Sidebar"; 
import Navbar from "./Navbar";   

const AdminPanel = () => {
  return (
    <Flex direction="column" minH="100vh" overflow="hidden">
      <Navbar />
      <Flex flex="1" mt="74px" overflow="hidden">
        <Sidebar />
        <Box
          as="main"
          flex="1"
          p={4}
          ml="200px"
          height="calc(100vh - 74px)"
          overflow="hidden"
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default AdminPanel;
