
// Component for previewing calendar events from .ics
import React from 'react';
import {parseIcsFile} from '../_utils/icsParser';
import fs from 'fs';
import { join } from 'path';
import { cookies } from 'next/headers'; // this is for back-end cookie parsing

const CalendarEvent = () => {
  // Call the icsParser class to parse the .ics file and get the event details
  const userId = cookies()?.get('userId')?.value;
  if(!userId){
    console.log("Error: CalendarEvent, no ics file found for user:", userId);
    return;
  }
  const filePath = join(process.cwd(), 'src', 'app', 'api', 'upload', 'user_files', userId, 'eSyllabus.ics'); // this should be the correct path
  // Check if the file exists synchronously
  if (fs.existsSync(filePath)) {
    console.log(`File exists at path: ${filePath}`);
    // File exists, you can perform further actions here
  } else {
    console.error(`File does not exist at path: ${filePath}`);
    return;
  }
  const calendarEvents = parseIcsFile(filePath); // Assuming parseICS File returns an array of event details

  return (
    <div className="calendar-events">
        {calendarEvents.map((event, index) => (
        <div key={index} className="event-container">
            <p className="event-title">{event.title}</p>
            <p className="event-start-date">Start Date: {event.start_date}</p>
            {event.end_date && <p className="event-end-date">End Date: {event.end_date}</p>}
            {event.location && <p className="event-location">Location: {event.location}</p>}
            {event.description && <p className="event-description">Description: {event.description}</p>}
        </div>
    ))}
    </div>)};

export default CalendarEvent;
