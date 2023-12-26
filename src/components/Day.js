import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import './day.css';
 
export default function Day({ day, rowIdx, month }) {
 
  const [eventCount, setEventCount] = useState(0);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);
 
  useEffect(() => {
    console.log("Rendering Day component with date:", day.format("DD/MM/YYYY"));
    console.log("filteredEvents:", filteredEvents);
 
    const formattedDay = day.format("YYYY-MM-DD");
    console.log("formattedDay:", formattedDay);
 
    const events = filteredEvents.filter(
      (evt) => {
        const eventDay = dayjs(evt.day).format("YYYY-MM-DD");
        console.log("eventDay:", eventDay);
       
        // Compare month and year only
        return dayjs(eventDay).isSame(day, 'month');
      }
    );
 
    console.log("events:", events);
 
    setEventCount(events.length);
  }, [filteredEvents, day]);
 
  function getCurrentDayClass() {
    console.log("day in getCurrentDayClass:", day.format("DD/MM/YYYY"));
    console.log("eventCount in getCurrentDayClass:", eventCount);
 
    const currentDate = dayjs();
    const hasEvents = eventCount > 0;
 
    if (hasEvents && day.isAfter(currentDate, 'day')) {
      return "bg-future-date";
    }
 
    return day.isSame(currentDate, 'day') ? "bg-blue-600" : "";
  }
 
  return (
    <div className={`border border-gray-200 flex flex-col calendarbox ${getCurrentDayClass()}`}>
      <div className="flex flex-col">
        {rowIdx === 0 && (
          <p className="text-sm text-slate-950 day text-center bg-personal">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-base p-1 my-1 text-center`}
        >
          {day.format("DD")}
          {eventCount > 0 && (
            <span className="ml-1 text-xl text-gray-500">{`(${eventCount})`}</span>
          )}
        </p>
      </div>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {filteredEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEvent(evt)}
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm  mb-1 truncate`}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}