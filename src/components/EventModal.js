import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import RegistrationForm from "./registration";
import GlobalContext from "../context/GlobalContext";
import axios from "axios";

export default function EventModal() {
  const { daySelected, showEventModal, setShowEventModal } = useContext(GlobalContext);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isEventDatePast = (eventDate) => {
    // const currentDate = moment();
    const formattedCurrentDate = moment().startOf("day");

    return eventDate.isBefore(formattedCurrentDate);
  };

  useEffect(() => {
    if (daySelected) {
      const formattedDate = daySelected.format("DD/MM/YYYY");

      axios.get(`http://localhost:4000/search-course?date=${formattedDate}`)
        .then(response => {
          setEventsForSelectedDay(response.data);
        })
        .catch(error => {
          console.error('Error while fetching event data', error);
        });
    }
  }, [daySelected]);

  const handleCloseModal = () => {
    setShowEventModal(false);
  };

  const handleOpenRegistrationForm = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
    setShowEventModal(true);
  };

  const shouldShowTable = eventsForSelectedDay.some(event => !isEventDatePast(moment(event.startProgramDates, "DD/MM/YYYY")));

  return (
    <div className={`modal ${showEventModal ? "visible" : "hidden"}`} style={{ backgroundColor: "#eb8c00" }}>
      <div className="modal-content">
        <button className="close" onClick={() => handleCloseModal()}>&#10006;</button>
        <h2><b>Events for {daySelected ? daySelected.format("DD/MM/YYYY") : ''}</b></h2>

        {shouldShowTable ? (
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
                {eventsForSelectedDay.map((event, index) => (
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
                        {!isEventDatePast(moment(event.startProgramDates, "DD/MM/YYYY")) && (
                          <button className="apply-button" onClick={() => handleOpenRegistrationForm(event)}>
                            Apply
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No events found for the selected date .</p>
        )}
      </div>
      {showRegistrationForm && selectedEvent && (
        <div className="registration-form-container">
          <button onClick={() => setShowRegistrationForm(false)}>&#10006;</button>
          <RegistrationForm event={selectedEvent} onClose={handleOpenRegistrationForm}/>
        </div>
      )}
    </div>
  );
}
