import React, { useContext, useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import GlobalContext from "../context/GlobalContext";
import axios from "axios";
import LinearProgress from '@mui/material-next/LinearProgress';

export default function EventModal() {
  const {daySelected, showEventModal, setShowEventModal } = useContext(GlobalContext);
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (daySelected) {
      setLoading(true);
      const formattedDate = daySelected.format("DD-MM-YYYY");
      const debounceTimeout = setTimeout(() => {
        axios.get(`https://prod-18.eastus.logic.azure.com/workflows/1fc147fbd0994200825bfc4958b730f7/triggers/manual/paths/invoke/searchcourse/${formattedDate}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xKUXOnyZPeNNJVLbjVjMG_F0_MfIxhuoaea84mggfrU`)
          .then(response => {
            const eventData = response.data.Table1;
            setShowEventModal(eventData.length > 0);
            setEventsForSelectedDay(eventData);
            setLoading(false);
          })
          .catch(error => {
            console.error("Not working", error)
          });
      }, 500);
      return () => {
        clearTimeout(debounceTimeout);
        
      };
    }
  }, [daySelected]);

  const formatDate = useMemo(() => (currentDate) => {
    const todayDate = dayjs().format('DD-MM-YYYY');
    if(todayDate === currentDate){
      return 'Today'
    }
    const parts = currentDate.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    function getSuffix(day){
      if(day >= 11 && day <= 13){
        return 'th'
      }
      switch(day%10){
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    }
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const ordinalSuffix = getSuffix(day);
    const monthName = monthNames[month - 1];
    const formattedDate = `${day}${ordinalSuffix} ${monthName}, ${year}`;
    return formattedDate;
  }, []);

  const handleCloseModal = () => {
    setShowEventModal(false);
  };

  function RedirectToPage(url) { 
    if(url){
      window.location.href = url;  
    } 
  }  
  
  function convertTimeToLocale(time) {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    const adjustedHours = period === 'PM' ? hours + 12 : hours;
    const userDate = new Date();
    
    userDate.toLocaleTimeString('en-US', { timeZone: userTimezone });
    userDate.setHours(adjustedHours, minutes, 0, 0);
    
    const localTime = userDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: userTimezone
    });
    return localTime;
  }

  return (
    <div className={`${showEventModal ? "visible" : "hidden"}`}>
      {console.log("Inside EventModal",showEventModal)}
      <div className="modal-content">
        <div className="modal-content-header">
          <h2 className="modal-content_title"><b>Events for  {daySelected ? formatDate(daySelected.format("DD-MM-YYYY")) : ''}</b></h2>
          <button className="modal-cross" onClick={handleCloseModal}>&#10006;</button>
        </div>
        {loading ? (
          <LinearProgress />
        ) : (
          <div className="modal-events-details">
            {eventsForSelectedDay.map((event) => (
              <div className="card">
                <h3 className="card__title">{event.courseName}</h3>
                <p className="card__content">{`From ${convertTimeToLocale(event.startTime)} to ${convertTimeToLocale(event.endTime)}`}</p>
                <div className="card__date">{`Starts from ${formatDate(event.startProgramDates)}`}</div>
                {console.log("At EventModal", event)}
                {event.registrationLink ? (
                  <div className="card__arrow">
                    <p className="card__arrow_click" onClick={() => RedirectToPage(event.registrationLink)}>Register Now</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" >
                      <path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="card__arrow">
                    <p className="card__arrow_click" >TBD</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
