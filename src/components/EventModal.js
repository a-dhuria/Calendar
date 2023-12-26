import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import RegistrationForm from "./registration";
import GlobalContext from "../context/GlobalContext";
import axios from "axios";
// const { parse, isBefore, isAfter, isEqual, addDays, format} = require('date-fns');
 
export default function EventModal() {
  const { daySelected, showEventModal, setShowEventModal } = useContext(GlobalContext);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
 
  const isEventDatePast = (eventStartDate, eventEndDate) => {
    const currentDate = moment().startOf("day");
    return currentDate.isAfter(eventEndDate, 'day');
  };
 
  useEffect(() => {
    if (daySelected) {
      const formattedDate = daySelected.format("DD-MM-YYYY");
      axios.get(`https://prod-37.eastus.logic.azure.com/workflows/ca04d5b3339543f58eff256edcd0376f/triggers/manual/paths/invoke/searchcourse/${formattedDate}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CLijqAIpvFMyhF_NeR3BxLvuyJ2ptv00Ud_OEquK0DQ`)
        .then(response => {
          const eventData = response.data.Table1 || [];
          const selectedDate = moment(formattedDate, "DD-MM-YYYY");
          const futureEvents = eventData.filter(event => {
            const eventStartDate = moment(event.startProgramDates, "DD-MM-YYYY");
            return eventStartDate.isAfter(moment(), 'day');
          });
 
          const eventsForSelectedDay = [...futureEvents];
 
          setEventsForSelectedDay(eventsForSelectedDay);
          setShowEventModal(eventsForSelectedDay.length > 0);
        })
        .catch(error => {
          console.error('Error while fetching event data', error);
        });
    }
  }, [daySelected, setShowEventModal]);
 
  const handleCloseModal = () => {
    setShowEventModal(false);
  };
 
  const handleOpenRegistrationForm = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };
 
  return (
<div className={`modal ${showEventModal ? "visible" : "hidden"}`}>
<div className="modal-content">
<button className="close" onClick={() => handleCloseModal()}>&#10006;</button>
<h2><b>Events for {daySelected ? daySelected.format("DD-MM-YYYY") : ''}</b></h2>
 
        {eventsForSelectedDay.length > 0 ? (
<div className="table-container">
<table className="data-table">
<thead>
<tr>
                  {/* <th>Source</th> */}
<th>Start Program Date</th>
<th>End Program Date</th>
<th>Start Time</th>
<th>End Time</th>
<th>Course Name</th>
                  {/* <th>Target Audience</th> */}
<th>Format</th>
<th>Registration</th>
</tr>
</thead>
<tbody className="tbody1">
                {eventsForSelectedDay.map((event, index) => {
                  const eventStartDate = moment(event.startProgramDates, "DD-MM-YYYY");
                  const eventEndDate = moment(event.endProgramDates, "DD-MM-YYYY");
 
                  if (!isEventDatePast(eventStartDate, eventEndDate)) {
                    return (
<tr key={index}>
                        {/* <td>{event.source}</td> */}
<td>{event.startProgramDates}</td>
<td>{event.endProgramDates}</td>
<td>{event.startTime}</td>
<td>{event.endTime}</td>
<td>{event.courseName}</td>
                        {/* <td>{event.targetAudience}</td> */}
<td>{event.format}</td>
<td>
<div>
                            {!isEventDatePast(eventStartDate, eventEndDate) && (
<button className="apply-button" onClick={() => handleOpenRegistrationForm(event)}>
                                Apply
</button>
                            )}
</div>
</td>
</tr>
                    );
                  }
 
                  return null; // Exclude events with past dates
                })}
</tbody>
</table>
</div>
        ) : (
<p>No events found for the selected date.</p>
        )}
</div>
      {showRegistrationForm && selectedEvent && (
<div className="registration-form-container">
<button onClick={() => setShowRegistrationForm(false)}>&#10006;</button>
<RegistrationForm event={selectedEvent} onClose={handleOpenRegistrationForm} />
</div>
      )}
</div>
  );
}