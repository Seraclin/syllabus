# eSyllabus
For Emory Spring 2024 CS385 - AI Entrepreneurship
This project uses `Next.js v14.1.3`, `PyMuPDF`, and `GPT3.5-turbo`
## What is eSyllabus?
Unleash the power of our user-friendly AI syllabus scheduler – where efficiency meets accuracy, eliminating the need for tedious manual searches and streamlining your educational experience. eSyllabus automates the creation of a consolidated, master syllabus by analyzing individual syllabi for the semester with the ability to export to external calendars.
- Able to process multiple PDF files all at once
- 2MB upload limit per user
- User can generate an iCalendar (.ics) file
- Works only on text-based PDFs
- Only extracts date-related event information
- Users can see basic preview of events
## How to use?
At the moment, we don't have a website that you can visit, but you can try running the project on your own local environment. Simply, just upload your PDFs via the upload button, press the generate button to process the files (requires an OpenAI API key), and then download the output iCalendar file. The iCalendar file can be then imported into any calendar app that supports the `.ics` file type. 