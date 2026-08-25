import "./style.css";
import {
  generatePassword,
  type PasswordOptions,
} from "./passwordGenerator";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App element not found");
}

app.innerHTML = `
  <main class="container">
    <section class="generator-card">
      <div class="header">
        <div class="logo">🔐</div>
        <h1>Password Generator</h1>
        <p>Create a strong and secure password in seconds.</p>
      </div>

      <div class="password-container">
        <input
          id="password"
          type="text"
          value=""
          readonly
          placeholder="Your password will appear here"
        />
        <button id="copyButton" class="copy-button">
          Copy
        </button>
      </div>

      <div class="strength-container">
        <div class="strength-header">
          <span>Password strength</span>
          <span id="strengthText">—</span>
        </div>

        <div class="strength-bar">
          <div id="strengthBar"></div>
        </div>
      </div>

      <div class="settings">
        <div class="setting-header">
          <label for="length">Password length</label>
          <span id="lengthValue">16</span>
        </div>

        <input
          id="length"
          type="range"
          min="4"
          max="64"
          value="16"
        />

        <label class="checkbox">
          <input id="lowercase" type="checkbox" checked />
          <span>Lowercase letters</span>
        </label>

        <label class="checkbox">
          <input id="uppercase" type="checkbox" checked />
          <span>Uppercase letters</span>
        </label>

        <label class="checkbox">
          <input id="numbers" type="checkbox" checked />
          <span>Numbers</span>
        </label>

        <label class="checkbox">
          <input id="symbols" type="checkbox" checked />
          <span>Symbols</span>
        </label>
      </div>

      <p id="error" class="error"></p>

      <button id="generateButton" class="generate-button">
        Generate Password
      </button>
    </section>
  </main>
`;

const passwordInput =
  document.querySelector<HTMLInputElement>("#password")!;

const copyButton =
  document.querySelector<HTMLButtonElement>("#copyButton")!;

const generateButton =
  document.querySelector<HTMLButtonElement>("#generateButton")!;

const lengthInput =
  document.querySelector<HTMLInputElement>("#length")!;

const lengthValue =
  document.querySelector<HTMLSpanElement>("#lengthValue")!;

const strengthText =
  document.querySelector<HTMLSpanElement>("#strengthText")!;

const strengthBar =
  document.querySelector<HTMLDivElement>("#strengthBar")!;

const errorElement =
  document.querySelector<HTMLParagraphElement>("#error")!;

const checkboxes = {
  lowercase: document.querySelector<HTMLInputElement>("#lowercase")!,
  uppercase: document.querySelector<HTMLInputElement>("#uppercase")!,
  numbers: document.querySelector<HTMLInputElement>("#numbers")!,
  symbols: document.querySelector<HTMLInputElement>("#symbols")!,
};

function getOptions(): PasswordOptions {
  return {
    length: Number(lengthInput.value),
    lowercase: checkboxes.lowercase.checked,
    uppercase: checkboxes.uppercase.checked,
    numbers: checkboxes.numbers.checked,
    symbols: checkboxes.symbols.checked,
  };
}

function calculateStrength(options: PasswordOptions): string {
  let score = 0;

  if (options.length >= 8) score++;
  if (options.length >= 12) score++;
  if (options.length >= 16) score++;

  if (options.lowercase) score++;
  if (options.uppercase) score++;
  if (options.numbers) score++;
  if (options.symbols) score++;

  if (score <= 3) return "Weak";
  if (score <= 5) return "Medium";
  return "Strong";
}

function updateStrength(options: PasswordOptions): void {
  const strength = calculateStrength(options);

  strengthText.textContent = strength;

  strengthBar.className = "";

  if (strength === "Weak") {
    strengthBar.classList.add("weak");
  } else if (strength === "Medium") {
    strengthBar.classList.add("medium");
  } else {
    strengthBar.classList.add("strong");
  }
}

function generate(): void {
  try {
    const options = getOptions();

    const password = generatePassword(options);

    passwordInput.value = password;
    errorElement.textContent = "";

    updateStrength(options);
  } catch (error) {
    errorElement.textContent =
      error instanceof Error
        ? error.message
        : "Something went wrong.";
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
  updateStrength(getOptions());
});

Object.values(checkboxes).forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateStrength(getOptions());
  });
});

generateButton.addEventListener("click", generate);

copyButton.addEventListener("click", async () => {
  if (!passwordInput.value) return;

  await navigator.clipboard.writeText(passwordInput.value);

  copyButton.textContent = "Copied!";

  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1500);
});

generate();