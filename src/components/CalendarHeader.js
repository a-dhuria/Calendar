// CourseSearch.js
import React, { useState, useEffect, useContext } from "react";
import "./calendarheader.css"
import dayjs from "dayjs";
import logo from "../assets/logo-pwc-white-2x.png";
import GlobalContext from "../context/GlobalContext";
import RegistrationForm from "./registration";
import ModalContainer from "./Modalcontainer";
import "./eventmodal.css";
import "./modalcontainer.css";

const CourseDetailsModal = ({ courseDetails, onClose, onApplyClick }) => {
  const handleApplyClick = () => {
    onClose();
    onApplyClick();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="course-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <button className="close" onClick={onClose}>
            &#10006;
          </button>
          <h3>{courseDetails.courseName}</h3>
          <table className="course-details-table">
            <tbody>
              <tr>
                <td>Source:</td>
                <td>{courseDetails.source}</td>
              </tr>
              <tr>
                <td>Start Program Dates:</td>
                <td>{courseDetails.startProgramDates}</td>
              </tr>
              <tr>
                <td>End Program Dates:</td>
                <td>{courseDetails.endProgramDates}</td>
              </tr>
              <tr>
                <td>Start Time:</td>
                <td>{courseDetails.startTime}</td>
              </tr>
              <tr>
                <td>End Time:</td>
                <td>{courseDetails.endTime}</td>
              </tr>
              <tr>
                <td>Target Audience:</td>
                <td>{courseDetails.targetAudience}</td>
              </tr>
              <tr>
                <td>Format:</td>
                <td>{courseDetails.format}</td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleApplyClick} className="apply-button">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseSearch = () => {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationEventDetails, setRegistrationEventDetails] = useState(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    // setLoading(true);

    fetch(`https://prod-03.eastus.logic.azure.com/workflows/cee80b6774154f629872cdfcb3b9534e/triggers/manual/paths/invoke/coursedetails/${searchTerm}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=oAYgqU-7DO-hvw6T6rmAgvmVVGT3ZclBvvBUH-aZgTU`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
        setSearchResults(data.Table1);
        // setLoading(false);
        setDropdownOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // setLoading(false);
      });
  }, [searchTerm]);

  const handlePrevMonth = () => {
    setMonthIndex(monthIndex - 1);
  };

  const handleNextMonth = () => {
    setMonthIndex(monthIndex + 1);
  };

  const handleReset = () => {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
    closeDropdown();
  };

  const handleCourseClick = (courseDetails) => {
    setSelectedCourseDetails(courseDetails);
    const { courseName, startProgramDates, endProgramDates } = courseDetails;
    console.log("Selected Course Details:", {
      courseName,
      startProgramDates,
      endProgramDates,
    });
    setIsModalOpen(true);
    closeDropdown();
  };

  const closeDropdown = () => {
    setSearchTerm("");
    setSearchResults([]);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseDetails(null);
  };

  const handleApplyClick = () => {
    if (selectedCourseDetails) {
      const eventDetails = {
        email: "", // Set the email value from your form state
        source: selectedCourseDetails.source,
        startProgramDates: selectedCourseDetails.startProgramDates,
        endProgramDates: selectedCourseDetails.endProgramDates,
        startTime: selectedCourseDetails.startTime,
        endTime: selectedCourseDetails.endTime,
        courseName: selectedCourseDetails.courseName,
        targetAudience: selectedCourseDetails.targetAudience,
        format: selectedCourseDetails.format,
      };

      setIsRegistrationOpen(true);
      setRegistrationEventDetails(eventDetails);
      closeModal(); // Close modal after clicking "Apply"
    }
  };

  return (
    <header>
      <div className="header-row-1">
        <img src={logo} alt="PwC Logo - White outlined" className="logo" />
        <p className="header-row-1-title">Cloud Academy Calendar</p>
      </div>
      <div className="header-row-2">
      <button onClick={handleReset} className="button-calendar-today">
        Today
      </button>
      <button onClick={handlePrevMonth} className="button-navigation-arrows">
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth} className="button-navigation-arrows">
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      <p className="ml-4 text-xl text-black-500">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </p>
      <div>
        <input
          className="searchFor"
          placeholder="Search for a course"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* {loading && <p>Loading...</p>} */}
        {searchResults.length > 0 && dropdownOpen && (
          <div className="dropdown">
            <ul>
              {searchResults.map((result) => (
                <li key={result.id} onClick={() => handleCourseClick(result)}>
                  <strong>{result.courseName}</strong>
                  <br />
                  Start Date: {result.startProgramDates} End Date:{result.endProgramDates}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {selectedCourseDetails && isModalOpen && (
        <CourseDetailsModal
          courseDetails={selectedCourseDetails}
          onClose={closeModal}
          onApplyClick={() => {
            handleApplyClick();
            closeModal(); // Close modal after clicking "Apply"
          }}
        />
      )}
      {isRegistrationOpen && (
        <ModalContainer>
          <RegistrationForm
            event={registrationEventDetails}
            onClose={() => setIsRegistrationOpen(false)}
          />
        </ModalContainer>
      )}
      </div>
     
    </header>
  );
};
 
export default CourseSearch;
 