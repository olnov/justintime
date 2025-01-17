import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("userName");
  const Role = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Flex
      as="nav"
      p="4"
      bg="#1a2035"
      color="white"
      justifyContent="space-between"
      alignItems="center"
      position="fixed"
      top="0"
      left="0"
      width="100%"
      zIndex="1000"
    >
      <Text fontSize="xl">Admin Panel</Text>
      <Flex alignItems="center">
        <MenuRoot>
          <MenuTrigger
            as={Button}
            p="0"
            bgColor="transparent"
            border="none"
            boxShadow="none"
            _hover={{
              bgColor: "transparent",
              border: "none",
              boxShadow: "none",
            }}
            _active={{
              bgColor: "transparent",
              border: "none",
              boxShadow: "none",
            }}
            _focus={{
              boxShadow: "none",
              outline: "none",
              border: "none",
              bgColor: "transparent",
            }}
            _focusVisible={{
                boxShadow: "none",
                outline: "none",
                border: "none",
                bgColor: "transparent",
            }}
          >
            <Avatar
              size="sm"
              name="Sage"
              src="https://bit.ly/sage-adebayo"
            />
            <VStack align="center">
                <Text ml="2">{fullName}</Text>
                <Text textStyle="xs">{Role}</Text>
            </VStack>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="profile">Profile</MenuItem>
            <MenuItem value="settings">Settings</MenuItem>
            <MenuItem value="logout" onClick={handleLogout}>
              Logout
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </Flex>
  );
};

export default Navbar;
