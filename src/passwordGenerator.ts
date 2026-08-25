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

function getRandomIndex(max: number): number {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);

  return randomValues[0] % max;
}

function getRandomCharacter(characters: string): string {
  return characters[getRandomIndex(characters.length)];
}

function shuffle(characters: string[]): string[] {
  for (let i = characters.length - 1; i > 0; i--) {
    const j = getRandomIndex(i + 1);

    [characters[i], characters[j]] = [
      characters[j],
      characters[i],
    ];
  }

  return characters;
}

export function generatePassword(options: PasswordOptions): string {
  const {
    length,
    lowercase,
    uppercase,
    numbers,
    symbols,
  } = options;

  if (length < 4 || length > 64) {
    throw new Error(
      "Password length must be between 4 and 64.",
    );
  }

  const characterSets: string[] = [];

  if (lowercase) characterSets.push(LOWERCASE);
  if (uppercase) characterSets.push(UPPERCASE);
  if (numbers) characterSets.push(NUMBERS);
  if (symbols) characterSets.push(SYMBOLS);

  if (characterSets.length === 0) {
    throw new Error(
      "Select at least one character type.",
    );
  }

  if (length < characterSets.length) {
    throw new Error(
      `Password length must be at least ${characterSets.length} when all selected character types are enabled.`,
    );
  }

  const allCharacters = characterSets.join("");
  const passwordCharacters: string[] = [];

  // Guarantee at least one character
  // from every selected character set.
  for (const characterSet of characterSets) {
    passwordCharacters.push(
      getRandomCharacter(characterSet),
    );
  }

  // Fill the remaining positions.
  while (passwordCharacters.length < length) {
    passwordCharacters.push(
      getRandomCharacter(allCharacters),
    );
  }

  // Shuffle so the guaranteed characters
  // aren't always at the beginning.
  return shuffle(passwordCharacters).join("");
}