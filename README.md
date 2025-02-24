# Calgebra

A CLI tool to sync Algebra Bernays University's student schedule to iCalendar format.

## Description

Calgebra is a command-line utility that helps Algebra University College students export their class schedule to the iCalendar (.ics) format. This allows students to import their academic schedule into various calendar applications like Google Calendar, Apple Calendar, or Microsoft Outlook.

## Features

- Secure login to Algebra's Infoeduka portal
- Fetches scheduled classes
- Converts schedule entries to iCalendar format
- Generates a standard .ics file with:
  - Class type and subject
  - Start and end times
  - Location (classroom)
  - Instructor information
  - Duration details

## Prerequisites

- [Deno](https://deno.land/) runtime installed on your system

## Installation

1. Clone this repository:
```bash
git clone https://github.com/dpskvn/calgebra.git
cd calgebra
```

## Usage

Run the script using Deno:

```bash
deno run --allow-net --allow-write main.ts
```

The program will:
1. Prompt for your Algebra student credentials
2. Connect to the student portal
3. Fetch your schedule
4. Generate an `algebra-schedule.ics` file in the current directory

You can also compile the script into a standalone executable:

```bash
deno compile --allow-net --allow-write main.ts
```

This will provide you with a standalone executable for your platform.

## File Structure

```
calgebra/
├── main.ts        # Main application logic
├── main_test.ts   # Tests for the main application
├── date.ts        # Date parsing and formatting utilities
├── date_test.ts   # Tests for date parsing and formatting
└── README.md
```

## Security

- Passwords are securely prompted and not stored
- Credentials are only used for authentication with Algebra's servers
- No data is sent to third-party services

## API Endpoints Used

- Login: `https://student.algebra.hr/digitalnareferada/api/login`
- Schedule: `https://student.algebra.hr/digitalnareferada/api/student/raspored/tjedni`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

You can run tests with:
```bash
deno test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Acknowledgments

- Thanks to Algebra Bernays University for providing the (undocumented) API
- Built with [Deno](https://deno.land/)

## Disclaimer

This is an unofficial tool and is not affiliated with Algebra Bernays University. Use at your own risk.
