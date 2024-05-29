import React, { useContext, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import GlobalContext from "../../Context/GlobalContext";
import "./Day.css";
import BoxData from "./BoxData/BoxData";

export default function Day({ day, rowIdx }) {
  const {
    setDaySelected,
    setShowEventModal,
    selectedDropValue,
    practiceSiteData,
    setPage,
  } = useContext(GlobalContext);

  function handleShowEventModal(eventDate) {
    const currentDate = dayjs();
    const isBiggerOrLarger = currentDate.isBefore(eventDate);
    setShowEventModal(isBiggerOrLarger);
  }

  function getCurrentDayClass() {
    const currentDate = dayjs();
    return day.isSame(currentDate, "day") ? "bg-blue-600" : "bg";
  }

  const hasEventsOnDay = useMemo(() => {
    const formattedDay = day.format("DD-MM-YYYY");
    const eventsOnDay = practiceSiteData.find(
      (evt) => evt.date === formattedDay
    );
    return eventsOnDay && eventsOnDay.courseCount > 0 ? "hasEvents" : "bg";
  }, [practiceSiteData, day]);

  function RedirectToPage(url) {
    if (url) {
      window.open(url, "_blank");
    }
  }

  function getEventDetails() {
    let formattedDay = day.format("DD-MM-YYYY");
    const eventsOnDay = practiceSiteData.find(
      (evt) => evt.date === formattedDay
    );

    return eventsOnDay && eventsOnDay.courseCount > 0 ? (
      <>
        {selectedDropValue ? (
          <BoxData day={day} />
        ) : (
          <div className="eventDetailsBox">
            {eventsOnDay.courses.map((course) => (
              <div className="force-overflow" key={course.key}>
                <p
                  className={`eventsDetailsOnBox_text ${
                    course.registrationLink ? "isClickableEvent" : ""
                  }`}
                  onClick={() => RedirectToPage(course.registrationLink)}
                >
                  {course.courseName}
                </p>
              </div>
            ))}
          </div>
        )}
      </>
    ) : null;
  }

  function getHoveredEventDetails() {
    const formattedDay = day.format("DD-MM-YYYY");
    const matchingDates = practiceSiteData.filter(
      (event) => event.date === formattedDay
    );
    if (matchingDates.length > 0) {
      return matchingDates.flatMap((event, index) =>
        event.courses.map((course, courseIndex) => (
          <div className="profile" key={`${index}-${courseIndex}`}>
            <h1 className="profile_title">{course.courseName}</h1>
          </div>
        ))
      );
    }
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <Grid item className="boxHeight">
      <Tooltip
        title={getHoveredEventDetails()}
        placement="bottom-end"
        arrow
        enterDelay={2000}
        leaveDelay={1}
      >
        {rowIdx === 0 && (
          <p className="text-slate-950 day text-center bg-personal daysWeek">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <div
          className={`border border-gray-200 flex flex-col calendarbox tooltip ${getCurrentDayClass()} ${hasEventsOnDay}`}
          onClick={() => {
            setDaySelected(day);
            handleShowEventModal(day);
          }}
        >
          <div className="flex flex-col">
            <p className={`text-base p-1 my-1 text-center daysNumber`}>
              {day.format("DD")}
            </p>
          </div>
          {getEventDetails()}
        </div>
      </Tooltip>
    </Grid>
  );
}
