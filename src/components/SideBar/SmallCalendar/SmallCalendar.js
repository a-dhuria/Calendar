// SmallCalendar.js
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../../../Context/GlobalContext";
import { getMonth } from "../../../util";
import './SmallCalendar.css';
import ModalContainer from '../../ModalContainer/Modalcontainer';

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(dayjs().month());
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showEventModalAtSmall, setShowEventModalAtSmall] = useState(false);
  
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
      const response = await axios.get('https://prod-53.eastus.logic.azure.com/workflows/eeca8fd7d94840cbb2e60ed0df2b3f13/triggers/When_a_HTTP_request_is_received/paths/invoke/allcourses?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=n3bdSqEO3mmxV_rxpBJNKmhtHS8yh981xY0uZVgyRYk');
      console.log(response.data)
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
      return "bg-orange-500 rounded-full text-white";
    } else if (currDay === slcDay) {
      return "bg-orange-100 rounded-full text-blue-600 font-bold";
    } else {
      return "";
    }
  }

  const isEventDatePast = (eventDate) => {
    const currentDate = new Date();
    return dayjs(eventDate).isBefore(currentDate, 'day');
  };

  function RedirectToPage(url) { 
    if(url){
      window.location.href = url;  
    } 
  }

  return (
    <div className="smallcalendar">
      <header className="smallcal">
        <p className="text-gray-500 font-bold smallCalMonth">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
            "MMMM YYYY"
          )}
        </p>
        <div>
          <button onClick={handlePrevMonth}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-1 chev" >
              chevron_left
            </span>
          </button>
          <button onClick={handleNextMonth}>
            <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2 chev">
              chevron_right
            </span>
          </button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-1 smallcal">
        {currentMonth[0].map((day, i) => (
          <span key={i} className="text-center weekdays">
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
                className={`${getDayClass(day)}`}
              >
                <span className="weekdays">{day.format("DD")}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
      <br />
      <button
      className="eventsModalOpenClickButton"  // Add the calendar-view-btn class
      onClick={() => {
        fetchUpcomingEvents();
        setShowEventModalAtSmall(true);
      }}
      >Upcoming Events</button>
      {showEventModalAtSmall && (
        <ModalContainer onClose={() => setShowEventModalAtSmall(false)}>
          <h2 className="allEventTitle">Upcoming Events</h2>
          <div className="allEventsDataTable">
            <table className="fl-table" id="style-3">
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
                        {!isEventDatePast(new Date(event.startProgramDates)) && event.registrationLink ? (
                          <button className="eventsModalOpenClickButton" onClick={()=>RedirectToPage(event.registrationLink)}>Apply</button>
                        )
                        :
                          (
                            <button className="upcoming-eventss">TBD</button>
                          )}
                      </div>  
                    </td>
                  </tr>
                ))}   
              </tbody>     
            </table>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
