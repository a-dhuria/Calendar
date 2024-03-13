import React, { useContext, useState, useEffect, useMemo } from "react";
import { parse, isBefore, isEqual, addDays } from 'date-fns';
import axios from "axios";
import dayjs from "dayjs";
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import GlobalContext from "../context/GlobalContext";
import './day.css';
 
export default function Day({ day, rowIdx }) {
  const { setDaySelected, setShowEventModal, daySelected, selectedDropValue} = useContext(GlobalContext);
  const [eventsCountandDate, setEventsCountandDate] = useState([]);
 
  const countAndOrganizeEvents = (eventData) => {
    const coursesByDate = {};
    eventData.forEach(({ startProgramDates, endProgramDates, courseName, startTime, endTime, format }) => {
      const startDate = parse(startProgramDates, 'dd-MM-yyyy', new Date());
      const endDate = parse(endProgramDates, 'dd-MM-yyyy', new Date());
 
      for (let currentDay = startDate; isBefore(currentDay, endDate) || isEqual(currentDay, endDate); currentDay = addDays(currentDay, 1)) {
        const formattedDate = currentDay.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-');
       
        coursesByDate[formattedDate] = coursesByDate[formattedDate] || { startProgramDates, endProgramDates, courses: [] };
        coursesByDate[formattedDate].courses.push({ courseName, startProgramDates, endProgramDates, startTime, endTime, format });
      }
    });
    const coursesCountByDate = Object.entries(coursesByDate).map(([date, { courses }]) => ({
      date,
      courseCount: courses.length,
      courses,
    }));
 
    setEventsCountandDate(coursesCountByDate);
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (selectedDropValue) {
          url = `https://prod-17.eastus.logic.azure.com/workflows/631fa072cd384239afcdfbc82e0e16da/triggers/manual/paths/invoke/coursecountbydatewithfilter/${selectedDropValue}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZcIrZZDvWhebpn2VR4Cc95aoxnkpMkEfujgiqPGDHF4`;
        } else {
          url = 'https://prod-62.eastus.logic.azure.com/workflows/53708f33e38142e1b3b56df534a9b5d0/triggers/manual/paths/invoke/coursecountbydate?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AgIJRP4YoKcWhQ0lF6RMwuGA1--wYQizRu6ZUxFPEsw';
        }
        const response = await axios.get(url);
        const eventData = response.data.Table1;
        countAndOrganizeEvents(eventData);
      } catch (error) {
        console.error('Unable to fetch events count and details', error);
      }
    };
    if (daySelected) {
      fetchData();
    }
  }, [daySelected, selectedDropValue]);

  function handleShowEventModal(eventDate) {
    const currentDate = dayjs();
    const isBiggerOrLarger = currentDate.isBefore(eventDate)
    console.log(isBiggerOrLarger)
    setShowEventModal(isBiggerOrLarger);
  }
 
  function getCurrentDayClass() {
    const currentDate = dayjs();
    return day.isSame(currentDate, 'day') ? "bg-blue-600" : "bg";
  }
 
  const hasEventsOnDay = useMemo(() => {
    const formattedDay = day.format("DD-MM-YYYY");
    const eventsOnDay = eventsCountandDate.find(evt => evt.date === formattedDay);
    return eventsOnDay && eventsOnDay.courseCount > 0 ? "hasEvents" : "bg";
  }, [eventsCountandDate, day]);
 
  // function getDetails() {
  //   const formattedDay = day.format("DD-MM-YYYY");
  //   const eventsOnDay = eventsCountandDate.find(evt => evt.date === formattedDay);
  //   return eventsOnDay && eventsOnDay.courseCount > 0 ? (
  //     <div className="bookmarkBtn">
  //       <span className="IconContainer">
  //         <svg viewBox="0 0 384 512" height="0.9em" className="icon">
  //           <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
  //         </svg>
  //       </span>
  //       <p className="text">{eventsOnDay.courseCount} Events</p>
  //     </div>
  //   ) : null;
  // }

  function RedirectToPage(url){
    if(url){
      window.location.href = url;
    }
  }

  function getEventDetails(){
    const formattedDay = day.format("DD-MM-YYYY");
    const eventsOnDay = eventsCountandDate.find(evt => evt.date === formattedDay);
    return eventsOnDay && eventsOnDay.courseCount > 0 ? (
      <div className="eventDetailsBox">
        {eventsOnDay.courses.map((course) => {
          return (
            <div className="force-overflow">
              {console.log("At Day.js", course)}
              <p className="eventsDetailsOnBox_text" onClick={()=> RedirectToPage(course)}>{course.courseName}</p>
            </div>
          )
        })}
      </div>
    ) : null;
  }

  function getHoveredEventDetails() {
    const formattedDay = day.format("DD-MM-YYYY");
    const matchingDates = eventsCountandDate.filter(event => event.date === formattedDay);
    if (matchingDates.length > 0) {
      return matchingDates.flatMap((event, index) =>
        event.courses.map((course, courseIndex) => (
          <div className="profile" key={`${index}-${courseIndex}`}>
            <h1 className="profile_title">{course.courseName}</h1>
            {/* <p className="profile_para">{`On ${formatDate(course.startProgramDates)} till ${formatDate(course.endProgramDates)}, From ${course.startTime} to ${course.endTime}`}</p> */}
          </div>
        ))
      );
    }
    return null;
  }
 
  function formatDate(currentDate) {
    const parts = currentDate.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
 
    function getSuffix(day) {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const ordinalSuffix = getSuffix(day);
    const monthName = monthNames[month - 1];
    return `${day}${ordinalSuffix} ${monthName}, ${year}`;
  }
 
  return (
    <Grid item className="boxHeight">
      <Tooltip title={(getHoveredEventDetails())} placement="bottom-end" arrow enterDelay={3000} leaveDelay={1} >
          <div className={`border border-gray-200 flex flex-col calendarbox tooltip ${getCurrentDayClass()} ${hasEventsOnDay}`} onClick={() => { setDaySelected(day); handleShowEventModal(day)}}>
            {rowIdx === 0 && (
              <p className="text-slate-950 day text-center bg-personal daysWeek">
                {day.format("ddd").toUpperCase()}
              </p>
            )}
            <div className="flex flex-col">
              <p className={`text-base p-1 my-1 text-center daysNumber`}>{day.format("DD")}</p>
            </div>
            {getEventDetails()}
          </div>
      </Tooltip>
    </Grid> 
  );
}