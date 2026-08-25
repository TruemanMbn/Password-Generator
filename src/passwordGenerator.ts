const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const {
    length,
    lowercase,
    uppercase,
    numbers,
    symbols,
  } = options;

  let characters = "";

  if (lowercase) characters += LOWERCASE;
  if (uppercase) characters += UPPERCASE;
  if (numbers) characters += NUMBERS;
  if (symbols) characters += SYMBOLS;

  if (characters.length === 0) {
    throw new Error("Select at least one character type.");
  }

  if (length < 4 || length > 64) {
    throw new Error("Password length must be between 4 and 64.");
  }

  let password = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    password += characters[index];
  }

  return password;
}