// src/App.js
import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal";
// import RegistrationForm from './components/registration';
//import EnrollmentForm from "./components/registration"; // Import the EnrollmentForm component
 
function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);
  // const eventDetails = { eventName: 'Sample Event', date: '2023-12-10' };
  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);
 
  return (
    <React.Fragment>
      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="main-content-area">
          <Sidebar />
          <Month month={currentMonth} />
          {showEventModal && <EventModal />}
        </div>
      </div>
    </React.Fragment>
  );
}
 
export default App;
 