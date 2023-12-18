// Sidebar.js

import React, { useState } from "react";
import SmallCalendar from "./SmallCalendar";
import "./Sidebar.css";

export default function Sidebar() {
  const [calendarData, setCalendarData] = useState([]);
  const [activeModal, setActiveModal] = useState(null);

  const handleCalendarViewClick = async () => {
    try {
      const response = await fetch('http://localhost:4000/all-courses-with-status');
      const data = await response.json();
      setCalendarData(data);
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
                  <tr key={course.id} className={getStatusClass(course.status)}>
                    <td>{course.courseName}</td>
                    <td>{course.startProgramDates}</td>
                    <td>{course.endProgramDates}</td>
                    <td>{course.status}</td>
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
      case 'completed':
        return 'completed-row';
      case 'ongoing':
        return 'ongoing-row';
      case 'upcoming':
        return 'upcoming-row';
      default:
        return '';
    }
  };

  return (
    <aside className="border p-5 w-64 sidebar">
      <SmallCalendar />
      <button className="calendar-view-btn" onClick={handleCalendarViewClick}>
        Calendar View
      </button>
      {activeModal && renderTable()}
    </aside>
  );


  
}
