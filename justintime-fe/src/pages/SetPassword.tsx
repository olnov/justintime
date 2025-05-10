import {
    PasswordInput,
  } from "@/components/ui/password-input";
import { Box, Button, Field, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setInitialPasswordByInvite } from "@/services/AuthService";
import { toaster } from "@/components/ui/toaster";


const SetPassword = () => {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const inviteToken = searchParams.get("inviteToken") || "";
    const navigate = useNavigate();
    
    const handleSetPassword = async (newPassword: string) => {
        // Simulate an API call to change the password
        try {
            await setInitialPasswordByInvite(inviteToken, newPassword);
            toaster.create({
                title: "Password changed successfully",
                description: "Your password has been updated.",
                type: "success",
            });
            navigate("/login");
        } catch (error) {
            toaster.create({
                title: "Error",
                description: `Failed to set password: ${error}`,
                type: "error",
            });
        }
    }


    return (
        <VStack mx="auto" maxW="lg" py={12} px={6} position="relative" zIndex={2}>
        <Box width="100%" spaceY={4} p={8} bg="white" boxShadow="lg" rounded="md">
            <Text textStyle={"md"} fontWeight={"semibold"}>Please set new password</Text>
            <Field.Root required>
            <Field.Label>
                {t('password')}<Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </Field.Root>
            <Field.Root required>
            <Field.Label>
                {t('confirm_password')}<Field.RequiredIndicator />
            </Field.Label>
            <PasswordInput
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            </Field.Root>
            <Button
                width="100%"
                bg="blue.400"
                color="white"
                _hover={{ bg: "blue.500" }}
                onClick={() => {
                    if (password === confirmPassword) {
                        handleSetPassword(password);
                    } else {
                        alert("Passwords do not match");
                    }
                }}
            >Save</Button>
        </Box>
        </VStack>
    );
};

export default SetPassword;