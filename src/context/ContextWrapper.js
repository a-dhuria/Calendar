import React, { useState, useEffect, useReducer, useMemo } from "react";
import GlobalContext from "./GlobalContext";
import { parse, isBefore, isEqual, addDays } from "date-fns";
import dayjs from "dayjs";
import axios from "axios";

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}
function initEvents() {
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [practiceSiteData, setPracticeSiteData] = useState([]);
  const [selectedDropValue, setSelectedDropValue] = useState("");
  const [page, setPage] = useState(1);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url =
          "https://prod-71.eastus.logic.azure.com/workflows/6cb8572e6795450abd8add7c836c1b43/triggers/When_a_HTTP_request_is_received/paths/invoke/coursecount?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=a7jT-C0mSLtnoNW0U9C-6XYKpyuzxxazLPa_GglJnj8";
        const response = await axios.get(url, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            withCredentials: true,
            mode: "no-cors",
          },
        });
        const eventData = response.data.Table1;
        setSiteData(eventData);
        countAndOrganizeEvents(eventData);
      } catch (error) {
        console.error("Unable to fetch events count and details", error);
      }
    };
    if (daySelected) {
      fetchData();
    }
  }, [daySelected, page]);

  const countAndOrganizeEvents = (eventData) => {
    const coursesByDate = {};
    eventData.forEach(
      ({
        startProgramDates,
        endProgramDates,
        courseName,
        startTime,
        endTime,
        format,
        registrationLink,
        practice,
      }) => {
        const startDate = parse(startProgramDates, "dd-MM-yyyy", new Date());
        const endDate = parse(endProgramDates, "dd-MM-yyyy", new Date());
        for (
          let currentDay = startDate;
          isBefore(currentDay, endDate) || isEqual(currentDay, endDate);
          currentDay = addDays(currentDay, 1)
        ) {
          const formattedDate = currentDay
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .split("/")
            .join("-");
          const existingCourses = coursesByDate[formattedDate]?.courses || [];
          coursesByDate[formattedDate] = {
            startProgramDates,
            endProgramDates,
            courses: [
              ...existingCourses,
              {
                courseName,
                startProgramDates,
                endProgramDates,
                startTime,
                endTime,
                format,
                registrationLink,
                practice,
              },
            ],
          };
        }
      }
    );
    const coursesCountByDate = Object.entries(coursesByDate).map(
      ([date, { courses }]) => ({
        date,
        courseCount: courses.length,
        courses,
      })
    );
    setPracticeSiteData(coursesCountByDate);
  };

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        selectedDropValue,
        setSelectedDropValue,
        siteData,
        setSiteData,
        practiceSiteData,
        setPracticeSiteData,
        page,
        setPage,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
