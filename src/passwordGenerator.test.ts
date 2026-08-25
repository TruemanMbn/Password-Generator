import { describe, expect, it } from "vitest";
import { generatePassword } from "./passwordGenerator";

describe("generatePassword", () => {
  it("generates a password with the requested length", () => {
    const password = generatePassword({
      length: 16,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
    });

    expect(password).toHaveLength(16);
  });

  it("generates lowercase-only passwords", () => {
    const password = generatePassword({
      length: 12,
      lowercase: true,
      uppercase: false,
      numbers: false,
      symbols: false,
    });

    expect(password).toMatch(/^[a-z]+$/);
  });

  it("generates numbers-only passwords", () => {
    const password = generatePassword({
      length: 12,
      lowercase: false,
      uppercase: false,
      numbers: true,
      symbols: false,
    });

    expect(password).toMatch(/^[0-9]+$/);
  });

  it("rejects passwords shorter than 4 characters", () => {
    expect(() =>
      generatePassword({
        length: 3,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
      }),
    ).toThrow();
  });

  it("rejects passwords longer than 64 characters", () => {
    expect(() =>
      generatePassword({
        length: 65,
        lowercase: true,
        uppercase: true,
        numbers: true,
        symbols: true,
      }),
    ).toThrow();
  });

  it("rejects when no character types are selected", () => {
    expect(() =>
      generatePassword({
        length: 16,
        lowercase: false,
        uppercase: false,
        numbers: false,
        symbols: false,
      }),
    ).toThrow();
  });
});