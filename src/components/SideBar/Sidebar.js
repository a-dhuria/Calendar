import React, { useState, useContext } from "react";
import SmallCalendar from "./SmallCalendar/SmallCalendar";
import "./Sidebar.css";
import Row from "./Row/Row";
import GlobalContext from "../../Context/GlobalContext";

const Sidebar = () => {
  const { siteData } = useContext(GlobalContext);
  // eslint-disable-next-line no-unused-vars
  const [activeModal, setActiveModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeData, setActiveData] = useState();
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);

  const handleCourseNameChange = (event) => {
    if (event.target.value === "") {
      setActiveData(siteData);
    } else {
      const searchData = siteData.filter((emp) => {
        return emp.courseName === event.target.value;
      });
      setActiveData(searchData);
    }
  };
  const handleStartDateChange = (event) => {
    if (event.target.value === "") {
      setActiveData(siteData);
    } else {
      const searchData = siteData.filter((emp) => {
        return emp.startProgramDates === event.target.value;
      });
      setActiveData(searchData);
    }
  };
  const handleEndDateChange = (event) => {
    if (event.target.value === "") {
      setActiveData(siteData);
    } else {
      const searchData = siteData.filter((emp) => {
        return emp.endProgramDates === event.target.value;
      });
      setActiveData(searchData);
    }
  };
  const handleStatusChange = (event) => {
    if (event.target.value === "") {
      setActiveData(siteData);
    } else {
      const searchData = siteData.filter((emp) => {
        return emp.status === event.target.value;
      });
      setActiveData(searchData);
    }
  };

  const rows = activeData
    ? activeData.map((emp) => <Row employee={emp} />)
    : null;

  const closeModal = () => {
    setActiveModal(null);
    setShowAllEventsModal(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  function renderOptions(uniqueValues) {
    return uniqueValues.map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ));
  }

  const renderTable = () => {
    return (
      <div className="modal">
        <button className="close" onClick={closeModal}>
          &#10006;
        </button>
        <h2 className="allEventTitle">List of all events</h2>
        <div className="allEventsDataTable">
          <table className="mainTable" id="style-3 example">
            <thead className="formHeader">
              <tr className="formHeader_tr">
                <th className="formHeader_tr_th">
                  Course Name
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={handleCourseNameChange}
                    >
                      <option value="">View All</option>
                      {renderOptions([
                        ...new Set(siteData.map((course) => course.courseName)),
                      ])}
                    </select>
                  </div>
                </th>
                <th className="formHeader_tr_th">
                  Start Date
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={handleStartDateChange}
                    >
                      <option value="">View All</option>
                      {renderOptions([
                        ...new Set(
                          siteData.map((course) => course.startProgramDates)
                        ),
                      ])}
                    </select>
                  </div>
                </th>
                <th className="formHeader_tr_th">
                  End Date
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={handleEndDateChange}
                    >
                      <option value="">View All</option>
                      {renderOptions([
                        ...new Set(
                          siteData.map((course) => course.endProgramDates)
                        ),
                      ])}
                    </select>
                  </div>
                </th>
                <th className="formHeader_tr_th">
                  Status
                  <div className="form-group">
                    <select
                      className="form-control"
                      onChange={handleStatusChange}
                    >
                      <option value="">View All</option>
                      {renderOptions([
                        ...new Set(siteData.map((course) => course.status)),
                      ])}
                    </select>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="formBody">
              {activeData
                ? rows
                : siteData.map((course) => (
                    <tr key={course.key} className="formBody_tr">
                      <td className="formBody_tr_td">{course.courseName}</td>
                      <td className="formBody_tr_td">
                        {course.startProgramDates}
                      </td>
                      <td className="formBody_tr_td">
                        {course.endProgramDates}
                      </td>
                      <td className="formBody_tr_td">{course.status}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <label className="hamburger-menu">
        <input type="checkbox" />
      </label>
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar--open" : ""}`}
        onClick={toggleSidebar}
      >
        <button
          className="eventsModalOpenClickButton"
          onClick={() => {
            setShowAllEventsModal(true);
          }}
        >
          All Events
        </button>
        <SmallCalendar />
        {showAllEventsModal && renderTable()}
        <div className="alert alert--error">
          <i className="fa fa-times-circle fa-2xl icon"></i>
          <div className="content">
            <h2 className="title">Key information</h2>
            <p className="para">
              For access to upcoming VILT sessions in three days, contact your
              local L&D team...
            </p>
            <p className="para2">
              Attendance at any session listed on this calendar is contingent
              upon successful registration.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
