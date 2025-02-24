import { promptSecret } from "@std/cli/prompt-secret";
import { parseDate, formatDateForICS } from "./date.ts";

/**
 * Generate an iCalendar event string from an event object.
 * @param {Object} event - The event details.
 * @param {string} event.datum - The date of the event.
 * @param {string} event.terminPocetak - The start time of the event.
 * @param {string} event.terminKraj - The end time of the event.
 * @param {string|number} event.terminTrajanje - The duration of the event in minutes.
 * @param {string} event.dvorana - The event location.
 * @param {string} event.nastavnik - The instructor of the event.
 * @param {string} event.tip - The type of the event.
 * @param {string} event.predmet - The subject of the event.
 * @throws {Error} Will throw an error if date/time parsing fails.
 * @returns {string} The iCalendar formatted event string.
 */
function generateICalEvent(event: any): string {
  const {
    datum,
    terminPocetak,
    terminKraj,
    terminTrajanje,
    dvorana,
    nastavnik,
    tip,
    predmet,
  } = event;

  const startDate = parseDate(datum, terminPocetak);
  const endDate = parseDate(datum, terminKraj);
  if (!startDate || !endDate) {
    throw new Error(
      "Error parsing date/time for event: " + JSON.stringify(event),
    );
  }

  const dtStamp = formatDateForICS(new Date());
  const dtStart = formatDateForICS(startDate);
  const dtEnd = formatDateForICS(endDate);
  const uid = crypto.randomUUID();
  const summary = `${tip} - ${predmet}`;
  const description = `Nastavnik: ${nastavnik} | Trajanje: ${terminTrajanje} minuta`;
  const location = dvorana;

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
  ].join("\r\n");
}

/**
 * Initiates the Algebra calendar sync by prompting the user for credentials.
 * Validates that the username is not empty and securely prompts for the password.
 * If the username is empty, logs an error and stops further execution.
 *
 * @async
 * @function algebraCalendar
 * @returns {Promise<void>} A promise that resolves when the calendar sync is complete.
 */
async function algebraCalendar() {
  const username = prompt("Enter username: ");
  if (!username) {
    console.error("Username cannot be empty");
    return;
  }

  const password = promptSecret("Enter password: ");
  if (!password) {
    console.error("Password cannot be empty");
    return;
  }

  const loginUrl = "https://student.algebra.hr/digitalnareferada/api/login";
  const loginPayload = { username, password };

  const loginResponse = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  });

  if (!loginResponse.ok) {
    console.error("Login failed with status", loginResponse.status);
    return;
  }

  const cookie = loginResponse.headers.get("set-cookie");
  if (!cookie) {
    console.error("No Set-Cookie header received during login.");
    return;
  }
  console.log("Login successful. Cookie received.");

  // Fetches the schedule data from the API.
  const scheduleUrl =
    "https://student.algebra.hr/digitalnareferada/api/student/raspored/tjedni";
  const scheduleResponse = await fetch(scheduleUrl, {
    method: "GET",
    headers: {
      Cookie: cookie,
    },
  });

  if (!scheduleResponse.ok) {
    console.error("Failed to fetch schedule. Status:", scheduleResponse.status);
    return;
  }

  const scheduleJson = await scheduleResponse.json();
  const events: any[] = scheduleJson.data;
  if (!events || !Array.isArray(events)) {
    console.error("Schedule data is not in the expected format.");
    return;
  }

  // Generate ICS content from the fetched events.
  let icsContent =
    ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//dpskvn//calgebra//EN"].join(
      "\r\n",
    ) + "\r\n";

  for (const event of events) {
    try {
      const eventStr = generateICalEvent(event);
      icsContent += eventStr + "\r\n";
    } catch (e) {
      console.error("Skipping event due to error:", e);
    }
  }
  icsContent += "END:VCALENDAR\r\n";

  // --- SAVE ICS FILE ---
  await Deno.writeTextFile("algebra-schedule.ics", icsContent);
  console.log("ICS file saved to algebra-schedule.ics");
}

export { generateICalEvent, algebraCalendar };

if (import.meta.main) {
  await algebraCalendar();
}
