// Helper function to parse .ics files for preview --> start/end date, title, description, location
// Ideally to be called by some kind of CalendarEvent component

import fs from 'fs';
import { join } from 'path';

function parseICS(fileContent) {
    const lines = fileContent.split('\n');
    const events = [];
    let currentEvent = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
        } else if (line.startsWith('END:VEVENT')) {
            events.push(currentEvent);
            currentEvent = {};
        } else if (line.startsWith('SUMMARY:')) {
            currentEvent.title = line.substring(8);
        } else if (line.startsWith('DESCRIPTION:')) {
            currentEvent.description = line.substring(12);
        } else if (line.startsWith('LOCATION:')) {
            currentEvent.location = line.substring(9);
        } else if (line.startsWith('DTSTART')) {
            const dateString = line.substring(8);
            currentEvent.start_date = parseDate(dateString);
        } else if (line.startsWith('DTEND')) {
            const dateString = line.substring(6);
            currentEvent.end_date = parseDate(dateString);
        }
    }

    return events;
}

function parseDate(dateString) {
    // Parse the date string here
    // TODO: make this work with multiple date formats depending on the date time format
    // GREGORIAN = '20120419T180000'
    // Sometimes no time is provided - DTSTART;VALUE=DATE:20120419'
    let outDate;
    if (dateString.includes('VALUE')) {  // cut off the VALUE=DATE:
        dateString = dateString.substring(11,)
    }

    if (dateString.includes('T')) {
        // Date string contains time portion
        // console.log("dateT:", dateString)
        const strYear = dateString.substring(0, 4);
        const strMonth = parseInt(dateString.substring(4, 6), 10) - 1; // months are zero-based
        const strDay = dateString.substring(6, 8);
        const strHour = dateString.substring(9, 11);
        const strMin = dateString.substring(11, 13);
        const strSec = dateString.substring(13, 15);
        outDate =  new Date(strYear,strMonth, strDay, strHour, strMin, strSec);
    } else {
        // Date string doesn't contain time portion
        // console.log("date:", dateString)
        const strYear = dateString.substring(0, 4);
        const strMonth = parseInt(dateString.substring(4, 6), 10) - 1; // Adjust for zero-based months
        const strDay = dateString.substring(6, 8);
        outDate = new Date(strYear, strMonth, strDay);
    }             
    
    const formattedDate = outDate.toLocaleString(); // Using toLocaleString method
    // console.log("test:", formattedDate); // Output: "4/5/2022, 12:00:00 PM" (example)
 
    return formattedDate; // For now, just return the raw string
}

export function parseIcsFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return parseICS(fileContent);
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

// Example usage:
// const icsFilePath = join(process.cwd(), 'path/to/your/file.ics');
// const calendarEvents = parseICSFile(icsFilePath);
// console.log(calendarEvents);
