/**
 * Utility function to pad a number with a leading zero if it's less than 10.
 *
 * @param {number} n - The number to pad.
 * @returns {string} The padded number as a string.
 */
function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Parse a date string and a time string into a Date object.
 * The date string should be in the format "dd.MM.yyyy." (e.g., "25.02.2025.")
 * and the time string should be in the format "HH:mm" (e.g., "18:45").
 *
 * @param {string} dateStr - The date string.
 * @param {string} timeStr - The time string.
 * @returns {(Date | null)} A Date object representing the local date and time, or null if parsing fails.
 */
function parseDate(dateStr: string, timeStr: string): Date | null {
  // Remove trailing dot from date string and split by '.'
  const parts = dateStr.replace(/\.$/, "").split(".");
  if (parts.length !== 3) {
    return null;
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  // Split time string "HH:mm"
  const timeParts = timeStr.split(":");
  if (timeParts.length !== 2) {
    return null;
  }
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Construct a Date (assuming local time). For ICS convert to UTC.
  return new Date(year, month, day, hours, minutes);
}

/**
 * Format a Date into the iCalendar date-time string format in UTC.
 * The format follows the pattern: yyyyMMdd'T'HHmmssZ (e.g., "20250225T174500Z").
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date-time string in UTC.
 */
function formatDateForICS(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

export { pad, parseDate, formatDateForICS };
