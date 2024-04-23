import React, { useContext, useState, useEffect, useMemo } from "react";  
import { parse, isBefore, isEqual, addDays } from 'date-fns';  
import axios from "axios";  
import dayjs from "dayjs";  
import Grid from '@mui/material/Grid';  
import Tooltip from '@mui/material/Tooltip';  
import GlobalContext from "../../Context/GlobalContext";  
import './Day.css';  
  
export default function Day({ day, rowIdx }) {  
  const { setDaySelected, setShowEventModal, daySelected, selectedDropValue} = useContext(GlobalContext);  
  const [eventsCountandDate, setEventsCountandDate] = useState([]);  
  const [page, setPage] = useState(1);  
  
  const countAndOrganizeEvents = (eventData) => {  
    const coursesByDate = {};  
    eventData.forEach(({ startProgramDates, endProgramDates, courseName, startTime, endTime, format, registrationLink, practice }) => {  
      const startDate = parse(startProgramDates, 'dd-MM-yyyy', new Date());  
      const endDate = parse(endProgramDates, 'dd-MM-yyyy', new Date());  
  
      for (let currentDay = startDate; isBefore(currentDay, endDate) || isEqual(currentDay, endDate); currentDay = addDays(currentDay, 1)) {  
        const formattedDate = currentDay.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-');  
  
        coursesByDate[formattedDate] = coursesByDate[formattedDate] || { startProgramDates, endProgramDates, courses: [] };  
        coursesByDate[formattedDate].courses.push({ courseName, startProgramDates, endProgramDates, startTime, endTime, format, registrationLink, practice});  
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
          url = `https://prod-09.eastus.logic.azure.com/workflows/0d69182701604e7c8a12b3632f801287/triggers/When_a_HTTP_request_is_received/paths/invoke/filter/${selectedDropValue}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=4Bzye-5EuXUkevkiQ2x8OtoUT_z9cNdC1ag77-qM3fY&page=${page}`;  
        } else {  
          url = 'https://prod-71.eastus.logic.azure.com/workflows/6cb8572e6795450abd8add7c836c1b43/triggers/When_a_HTTP_request_is_received/paths/invoke/coursecount?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=a7jT-C0mSLtnoNW0U9C-6XYKpyuzxxazLPa_GglJnj8';  
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
  }, [daySelected, selectedDropValue, page]);  
  
  function handleShowEventModal(eventDate) {  
    const currentDate = dayjs();  
    const isBiggerOrLarger = currentDate.isBefore(eventDate)  
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
  
  function RedirectToPage(url){  
    console.log("This is from RedirectToPage", url)  
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
              {course.registrationLink ? (   
                <p className="eventsDetailsOnBox_text isClickableEvent" onClick={() => RedirectToPage(course.registrationLink)}>{course.courseName}</p>  
              ):(  
                <p className="eventsDetailsOnBox_text" onClick={() => RedirectToPage(course.registrationLink)}>{course.courseName}</p>  
              )}  
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
  
  useEffect(() => {  
    const handleScroll = () => {  
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;  
      if (scrollTop + clientHeight >= scrollHeight - 20) {  
        setPage((prevPage) => prevPage + 1);  
      }  
    };  
    window.addEventListener('scroll', handleScroll);  
    return () => {  
      window.removeEventListener('scroll', handleScroll);  
    };  
  }, []);  
  
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
