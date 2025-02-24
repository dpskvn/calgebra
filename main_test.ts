import { generateICalEvent } from "./main.ts";

Deno.test("generateICalEvent creates valid iCalendar event string", () => {
  const event = {
    datum: "25.02.2025.",
    terminPocetak: "18:45",
    terminKraj: "20:15",
    terminTrajanje: 90,
    dvorana: "Dvorana 101",
    nastavnik: "Ivan Horvat",
    tip: "Predavanje",
    predmet: "Matematika",
  };

  const ical = generateICalEvent(event);

  if (!ical.startsWith("BEGIN:VEVENT")) {
    throw new Error("ICS event must start with 'BEGIN:VEVENT'");
  }
  if (!ical.includes("END:VEVENT")) {
    throw new Error("ICS event must end with 'END:VEVENT'");
  }
  if (!ical.includes("SUMMARY:Predavanje - Matematika")) {
    throw new Error("ICS event must include the correct summary");
  }
  if (!ical.includes("DESCRIPTION:Nastavnik: Ivan Horvat | Trajanje: 90 minuta")) {
    throw new Error("ICS event must include the correct description");
  }
  if (!ical.includes("LOCATION:Dvorana 101")) {
    throw new Error("ICS event must include the correct location");
  }
});

Deno.test("generateICalEvent throws error on invalid date input", () => {
  const event = {
    datum: "invalid date",
    terminPocetak: "18:45",
    terminKraj: "20:15",
    terminTrajanje: 90,
    dvorana: "Dvorana 101",
    nastavnik: "Ivan Horvat",
    tip: "Predavanje",
    predmet: "Matematika",
  };

  let errorThrown = false;
  try {
    generateICalEvent(event);
  } catch (e) {
    errorThrown = true;
  }
  if (!errorThrown) {
    throw new Error(
      "Expected generateICalEvent to throw an error when date parsing fails"
    );
  }
});