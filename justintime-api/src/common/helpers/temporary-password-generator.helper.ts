import { randomInt } from 'crypto';

// Generates a 10-symbols temporary password.
export const generateTemporaryPassword = (): string => {
  const characters = 'qwertyuiopasdfghjklzxcvbnm!@#$%^&*()0123456789';
  const codeLength: number = 10;
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = randomInt(0, characters.length);
    code += characters[randomIndex];
  }
  return code;
};
