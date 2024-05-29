import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../../../Context/GlobalContext";

export default function BoxData({ day }) {
  const { selectedDropValue, practiceSiteData } = useContext(GlobalContext);
  const [practiceData, setPracticeData] = useState([]);

  useEffect(() => {
    const formattedDay = day.format("DD-MM-YYYY");
    const eventsOnDay = practiceSiteData.find(
      (evt) => evt.date === formattedDay
    );

    if (eventsOnDay && eventsOnDay.courseCount > 0) {
      const searchData = eventsOnDay.courses.filter((data) => {
        return data.practice === selectedDropValue;
      });
      setPracticeData(searchData);
    } else {
      setPracticeData([]);
    }
  }, [selectedDropValue, day, practiceSiteData]);

  function RedirectToPage(url) {
    if (url) {
      window.open(url, "_blank");
    }
  }

  return (
    <div className="eventDetailsBox">
      {practiceData.map((data) => (
        <div className="force-overflow" key={data.key}>
          <p
            className={`eventsDetailsOnBox_text ${
              data.registrationLink ? "isClickableEvent" : ""
            }`}
            onClick={() => RedirectToPage(data.registrationLink)}
          >
            {data.courseName}
          </p>
        </div>
      ))}
    </div>
  );
}
