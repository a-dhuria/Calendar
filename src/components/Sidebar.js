import React, { useState } from "react";
import SmallCalendar from "./SmallCalendar";
import { parse, isBefore, isAfter } from 'date-fns';
import "./Sidebar.css";

const getStatus = (course) => {
  const currentDate = new Date();
  const courseStartDate = course.startProgramDates === 'TBD' ? null : parse(course.startProgramDates, 'dd-MM-yyyy', new Date());
  const courseEndDate = parse(course.endProgramDates, 'dd-MM-yyyy', new Date());

  if (courseStartDate === null) {
    return 'TBD';
  } else if (isBefore(currentDate, courseStartDate)) {
    return 'Upcoming';
  } else if (isAfter(currentDate, courseEndDate)) {
    return 'Completed';
  } else {
    return 'Ongoing';
  }
};

const Sidebar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const handleCalendarViewClick = async () => {
    try {
      const response = await fetch('https://prod-35.eastus.logic.azure.com/workflows/637b67ba42a142a8bcefe575f77bfd1b/triggers/manual/paths/invoke/allcourseswithstatus?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yAsCaU1VVgKpEJWPgcxRzuHYivuMemaeB4XEvAEUsK8');
      const data = await response.json();
      
      setCalendarData(data.Table1);
      openModal('calendarView');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderTable = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal} style={{ fontSize: '24px' }}>×</span>

          <div className="table-container">
            <h3 className="text-3xl font-semibold">
              {activeModal === 'calendarView' ? 'Calendar View' : 'Upcoming Events'}
            </h3>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {calendarData.map((course) => (
                  <tr key={course.id} className={getStatusClass(getStatus(course))}>
                    <td>{course.courseName}</td>
                    <td>{course.startProgramDates}</td>
                    <td>{course.endProgramDates}</td>
                    <td>{getStatus(course)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'completed-row';
      case 'Ongoing':
        return 'ongoing-row';
      case 'Upcoming':
        return 'upcoming-row';
      default:
        return '';
    }
  };

  return (
    <aside className="border p-5 w-64 sidebar">  
      <button className="calendar-view-btn" onClick={handleCalendarViewClick}>
        Full Calendar View
      </button>
      <SmallCalendar />
      {activeModal && renderTable()}
    </aside>
  );
};

export default Sidebar;