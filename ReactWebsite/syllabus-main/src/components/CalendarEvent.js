
// Component for previewing calendar events from .ics
// TODO: add an edit or delete button
import React from 'react';
import {parseIcsFile} from '../_utils/icsParser';
import fs from 'fs';
import { join } from 'path';

const CalendarEvent = () => {
  // Call the icsParser class to parse the .ics file and get the event details
  const filePath = join(process.cwd(), 'public', 'tmp', 'test1.ics');  // TODO: change this to your file path
  const calendarEvents = parseIcsFile(filePath); // Assuming parseICS File returns an array of event details

  return (
    <div className="calendar-events">
        {calendarEvents.map((event, index) => (
        <div key={index} className="event-container">
            <p className="event-title">Title: {event.title}</p>
            <p className="event-start-date">Start Date: {event.start_date}</p>
            {event.end_date && <p className="event-end-date">End Date: {event.end_date}</p>}
            {event.location && <p className="event-location">Location: {event.location}</p>}
            {event.description && <p className="event-description">Description: {event.description}</p>}
        </div>
    ))}
    </div>)};

export default CalendarEvent;
