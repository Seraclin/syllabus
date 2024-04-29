# eSyllabus
For Emory Spring 2024 CS385 - AI Entrepreneurship <br>
This project uses `Next.js v14.1.3`, `Python 3.10+`, `PyMuPDF`, and `GPT3.5-turbo`
## What is eSyllabus?
![image](https://github.com/Seraclin/syllabus/assets/53448490/6c34f9f5-c562-45a2-92d5-cfca904644b5)
Unleash the power of our user-friendly AI syllabus scheduler – where efficiency meets accuracy, eliminating the need for tedious manual searches and streamlining your educational experience. eSyllabus automates the process of manually inputting class assignments/assessments into your calendars by analyzing your syllabi for dates and exporting those events into an iCalendar file.
- Upload and process multiple PDF files all at once (2MB upload limit per user, only text-based PDFs)
- Generate an iCalendar (.ics) file from their uploaded files (only extracts date-related event information up to the limit)
- Basic preview of events
## How to install?
At the moment, we don't have a website that you can visit, but you can try running the project on your own local environment. Simply, just upload your PDFs via the upload button, press the generate button to process the files (requires an OpenAI API key), and then download the output iCalendar file. The iCalendar file can be then imported into any calendar app that supports the `.ics` file type.

To install the necessary dependencies to install this program, navigate to the `ReactWebsite/syllabus-main` directory and run `npm install` for installing the javascript dependencies and `pip install requirements.txt` for the python dependencies. Make sure to also have the latest versions of `node.js` and `Python` (as of May 1st, 2024) installed. Make sure to also create an `.env` file and add your OPENAI API key.

To run the dev environment use: `npm run dev`. 

## How to use
1. Press the 'choose file' button and select all the PDFs you wish to upload (2MB upload limit, text-based PDFs only)
2. Press the 'Upload' button to upload these files to the server. The total list of your uploaded files will be displayed below. (You can remove a file using the 'remove' button)
3. Press the 'Generate' button to start processing your files (this may take several minutes to complete)
4. Once done loading, select the 'Download' button to download the resulting iCalendar (.ics) file
5. This .ics file can now be imported into any calendar application that supports the format. 

Please note that this app uses your browser's cookies to track your files. If you clear your cookies, then your files will be lost. Cookies will naturally expire after a week starting from your first upload.
## Demo
[![eSyllabus Demo](https://img.youtube.com/vi/Lw09rk9ddHk/0.jpg)](https://www.youtube.com/watch?v=Lw09rk9ddHk)
<br>https://youtu.be/Lw09rk9ddHk?si=FawrFIU_86qevqoI
