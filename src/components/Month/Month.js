import React from "react";
import Day from "../Day/Day";
import "./Month.css";

export default function Month({ month }) {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-6 Month ">
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <React.Fragment key={idx}>
              <Day day={day} month={month} key={idx} rowIdx={i} />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
