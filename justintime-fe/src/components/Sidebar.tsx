import { Box, VStack } from "@chakra-ui/react";
import MenuItems from "./MenuItems";

const Sidebar = () => {
  return (
    <Box
      as="aside"
      w="200px"
      p="4"
      bg="#1a2035"
      position="fixed"
      top="64px"
      left="0"
      height="calc(100vh - 64px)"
    >
      <VStack spacing="4" align="stretch">
        <MenuItems />
      </VStack>
    </Box>
  );
};

export default Sidebar;