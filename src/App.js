// src/App.js
import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";

function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex} = useContext(GlobalContext);
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  function logScreenWidth() {
    console.log("Current screen width: "  +window.innerWidth);
    console.log("Current screen height: " +window.innerHeight);
  }
  document.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        logScreenWidth();
      }
    }
  );
 
  return (
    <React.Fragment>
      <div className="overall">
        <CalendarHeader />
        <div className="main-content-area">
          <Sidebar />
          <Month month={currentMonth} />
          <EventModal />
        </div>
      </div>
    </React.Fragment>
  );
}
 
export default App;
 