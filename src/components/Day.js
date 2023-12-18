import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import './day.css';

export default function Day({ day, rowIdx, month }) {
  const [dayEvents, setDayEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const {
    setDaySelected,
    setShowEventModal,
    filteredEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) =>
        dayjs(evt.day).format("DD/MM/YYYY") === day.format("DD/MM/YYYY")
    );
    setDayEvents(events);
    setEventCount(events.length);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    const currentDate = dayjs();
    const hasEvents = eventCount > 0;
    const isFirstDayOfTheMonth = day.date() === 1;
    const isFirstDayOfTheWeek = day.day() === 0; // Sunday

    // Check if it's the first day of the month and also the first day of the week
    if (isFirstDayOfTheMonth && isFirstDayOfTheWeek) {
      return "bg-gray-300 text-gray-500 rounded-full w-7"; // Shade the days of the previous month
    }

    // Check if there are no events for the current day and it's in the past
    if (!hasEvents && day.isBefore(currentDate, 'day')) {
      return "bg-red-500 text-white rounded-full w-7"; // Red color for past days with no events
    }

    return day.format("DD/MM/YYYY") === currentDate.format("DD/MM/YYYY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  return (
    <div className="border border-gray-200 flex flex-col calendarbox">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1 day">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-base p-1 my-1 text-center number ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
          {eventCount > 0 && (
            <span className="ml-1 text-xl text-gray-500">{`(${eventCount})`}</span>
          )}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedEvent(evt)}
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}
