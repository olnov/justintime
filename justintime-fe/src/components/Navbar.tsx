import { Button, Flex, Text, VStack, Avatar } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useNavigate } from "react-router-dom";
import { parseToken } from "../services/AuthService";
import LanguageSwitcher  from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const navigate = useNavigate();
  const fullName: string = localStorage.getItem("userName") || "";
  const userRole = parseToken(localStorage.getItem("token") as string).schools.map((schoolRole: { roles: unknown; }) => schoolRole.roles).join(", ");
  const isGlobalAdmin: boolean = parseToken(localStorage.getItem("token") as string).isGlobalAdmin;
  const Role: string | boolean = String(userRole) || (isGlobalAdmin ? "global_admin" : false);
  const { t } = useTranslation();
  
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    navigate("/login");
  };

  
  return (
    <Flex
      as="nav"
      p="3"
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
      <Text fontSize="xl" marginLeft={5} fontFamily={'heading'}>{t('admin_panel')}</Text>
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
            <Avatar.Root shape="rounded" size="sm">
              <Avatar.Fallback name={fullName} />
            </Avatar.Root>
            <VStack align="center">
                <Text ml={2} fontSize={'sm'}>{fullName}</Text>
                <Text textStyle="xs">{Role}</Text>
            </VStack>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="profile">{t('profile')}</MenuItem>
            <MenuItem value="settings">{t('settings')}</MenuItem>
            <MenuItem value="logout" onClick={handleLogout}>
              {t('logout')}
            </MenuItem>
            <LanguageSwitcher />
          </MenuContent>
        </MenuRoot>
      </Flex>
    </Flex>
  );
};

export default Navbar;
