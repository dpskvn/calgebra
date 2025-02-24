import {
    pad,
    parseDate,
    formatDateForICS,
  } from "./date.ts";
  
  Deno.test("pad function pads number correctly", () => {
    if (pad(5) !== "05") {
      throw new Error("Expected pad(5) to return '05'");
    }
    if (pad(10) !== "10") {
      throw new Error("Expected pad(10) to return '10'");
    }
  });
  
  Deno.test("parseDate returns correct Date for valid input", () => {
    const dateStr = "25.02.2025.";
    const timeStr = "18:45";
    const result = parseDate(dateStr, timeStr);
    if (result === null) {
      throw new Error("Expected a Date object, got null");
    }
    // JavaScript Date months are 0-indexed. February is 1.
    if (
      result.getFullYear() !== 2025 ||
      result.getMonth() !== 1 ||
      result.getDate() !== 25 ||
      result.getHours() !== 18 ||
      result.getMinutes() !== 45
    ) {
      throw new Error(
        `Parsed date is incorrect: ${result.toLocaleString()}`,
      );
    }
  });
  
  Deno.test("parseDate returns null for invalid date input", () => {
    const invalidDateStr = "25-02-2025";
    const timeStr = "18:45";
    const result = parseDate(invalidDateStr, timeStr);
    if (result !== null) {
      throw new Error("Expected invalid date format to return null");
    }
  });
  
  Deno.test("parseDate returns null for invalid time input", () => {
    const dateStr = "25.02.2025.";
    const invalidTimeStr = "6pm";
    const result = parseDate(dateStr, invalidTimeStr);
    if (result !== null) {
      throw new Error("Expected invalid time format to return null");
    }
  });
  
  Deno.test("formatDateForICS formats Date object to correct ICS format", () => {
    // Create a Date object corresponding to 2025-02-25T18:45:00Z
    const date = new Date(Date.UTC(2025, 1, 25, 18, 45, 0));
    const formatted = formatDateForICS(date);
    const expected = "20250225T184500Z";
    if (formatted !== expected) {
      throw new Error(
        `Expected ${expected}, but got ${formatted}`,
      );
    }
  });