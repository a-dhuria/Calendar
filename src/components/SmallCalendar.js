// SmallCalendar.js

import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../util";
import './smallcalendar.css';
import ModalContainer from './Modalcontainer';
import RegistrationForm from './registration';

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const {
    monthIndex,
    setSmallCalendarMonth,
    setDaySelected,
    daySelected,
  } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  async function fetchUpcomingEvents() {
    try {
      const response = await axios.get('https://prod-17.eastus.logic.azure.com/workflows/ac8cf86579904d358d03b03b3cc0a730/triggers/manual/paths/invoke/allcourses?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GVnS3KmVBdCRFxG58EM1lB3Exskb9zYGTltrQpjLwwU');
      setUpcomingEvents(response.data.Table1);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    }
  }

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }

  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }

  function getDayClass(day) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return "bg-blue-500 rounded-full text-white";
    } else if (currDay === slcDay) {
      return "bg-blue-100 rounded-full text-blue-600 font-bold";
    } else {
      return "";
    }
  }

  const isEventDatePast = (eventDate) => {
    const currentDate = new Date();
    return dayjs(eventDate).isBefore(currentDate, 'day');
  };

  const handleOpenRegistrationForm = (event) => {
    setSelectedEvent(event);
    setShowEventModal(false);
    setShowRegistrationModal(true);
  };

  return (
    <div className="mt-9 smallcalendar">
      <header className="flex justify-between">
        <p className="text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
            "MMMM YYYY"
          )}
        </p>
        <div>
          <button onClick={handlePrevMonth}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_left
            </span>
          </button>
          <button onClick={handleNextMonth}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day, i) => (
          <span key={i} className="text-sm py-1 text-center">
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {currentMonth.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setDaySelected(day);
                }}
                className={`py-1 w-full ${getDayClass(day)}`}
              >
                <span className="text-sm">{day.format("D")}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <br />
      <button
        className="Upcoming-events"  // Add the calendar-view-btn class
        onClick={() => {
          fetchUpcomingEvents();
          setShowEventModal(true);
        }}
      >
        Upcoming Events
      </button>

      {showEventModal && (
        <ModalContainer onClose={() => setShowEventModal(false)}>
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold ">
                  Upcoming Events
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowEventModal(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                {upcomingEvents.length > 0 && (
                  <div className="responsive-table">
                    <div className="table-container">
                      <table className="mt-4 border-collapse border border-gray-500">
                        <thead>
                          <tr>
                            <th>Source</th>
                            <th>Start Program Date</th>
                            <th>End Program Date</th>
                            <th>Start time</th>
                            <th>End Time </th>
                            <th>Course Name</th>
                            <th>Target Audience</th>
                            <th>Format</th>
                            <th>Registration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingEvents.map((event, index) => (
                            <tr key={index}>
                              <td>{event.source}</td>
                              <td>{event.startProgramDates}</td>
                              <td>{event.endProgramDates}</td>
                              <td>{event.startTime}</td>
                              <td>{event.endTime}</td>
                              <td>{event.courseName}</td>
                              <td>{event.targetAudience}</td>
                              <td>{event.format}</td>
                              <td>
                                <div>
                                  {!isEventDatePast(new Date(event.startProgramDates)) && (
                                    <button
                                      className="apply-button"
                                      onClick={() => handleOpenRegistrationForm(event)}
                                    >
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
                  </div>
                )}
              </div>  
            </div>
          </div>
        </ModalContainer>
      )}

      {showRegistrationModal && (
        <ModalContainer onClose={() => setShowRegistrationModal(false)}>
          <RegistrationForm
            event={selectedEvent}
            onClose={() => setShowRegistrationModal(false)}
          />
        </ModalContainer>
      )}
    </div>
  );
}
