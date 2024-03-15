// CourseSearch.js
import React, { useState, useEffect, useContext } from "react";
import "./CalendarHeader.css";
import dayjs from "dayjs";
import logo from "../../assets/logo-pwc-white-2x.png";
import banner from "../../assets/Cloud Academy - Internal header banner.png"
import GlobalContext from "../../context/GlobalContext";
import "../EventModal/EventModal.css";
import "../ModalContainer/ModalContainer.css";
import CourseDetailsModal from "../CourseDetailsModal/CourseDetailsModal";
import axios from "axios";

const CourseSearch = () => {
  const { monthIndex, setMonthIndex, selectedDropValue, setSelectedDropValue } = useContext(GlobalContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropDownData, setDropDown] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`https://prod-38.eastus.logic.azure.com/workflows/0c11c630e7f94c878dce84caedb8bfea/triggers/manual/paths/invoke/coursedetails/${searchTerm}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lKEL-Wtl1jKEuHzyA6p82PecK5rwWCy47MpZj-l3BJY`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const searchedData = data.Table1;
          setSearchResults(searchedData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 300);
    return () => clearTimeout(timeout); 

  }, [searchTerm]);


  useEffect(()=>{
    const url = 'https://prod-62.eastus.logic.azure.com/workflows/53708f33e38142e1b3b56df534a9b5d0/triggers/manual/paths/invoke/coursecountbydate?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AgIJRP4YoKcWhQ0lF6RMwuGA1--wYQizRu6ZUxFPEsw'
    axios.get(url).then(response=> {
      const profileDropDownData = response.data.Table1;
      setDropDown(profileDropDownData);
    })
  })


  // const handleClick = () => {
  //   setIsLoading(true);

  //   // Data to be posted to the API
  //   const postData = {
  //     // Define your data here
  //     // Example: key: value
  //   };

  //   fetch('https://prod-62.eastus.logic.azure.com/workflows/53708f33e38142e1b3b56df534a9b5d0/triggers/manual/paths/invoke/coursecountbydate?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AgIJRP4YoKcWhQ0lF6RMwuGA1--wYQizRu6ZUxFPEsw', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(postData)
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     // Handle the response from the API
  //     console.log('API response:', data);
  //     // You can perform any further actions based on the response here
  //   })
  //   .catch(error => {
  //     // Handle errors
  //     console.error('There was a problem with the fetch operation:', error);
  //   })
  //   .finally(() => {
  //     setIsLoading(false);
  //   });
  // };

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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourseDetails(null);
  };

  const handleDropdownChange = (event) => {  
    setSelectedDropValue(event.target.value);  
  };

  function renderOptions(uniqueValues) {
    return uniqueValues.map(value => (
      <option value={value} className="formControlPractice_option">{value}</option>
    ));
  }

  return (
    <header className="Main-header">
      <div className="header-row-1">
        <div className="header-logos">
          <img src={logo} alt="PwC Logo - White outlined" className="logo" />
          <img src={banner} alt="PWC Banner" className="banner"/> 
        </div>
        <p className="header-row-1-title">Cloud Academy Calendar</p>
      </div>
      <div className="header-row-2">
        <button onClick={handleReset} className="button-calendar-today">
          Today
        </button>
        <button
          onClick={handlePrevMonth}
          className="button-navigation-arrows"
        >
          <span className="material-icons-outlined cursor-pointer text-orange-50 mx-2 headerArrows">
            chevron_left
          </span>
        </button>
        <button
          onClick={handleNextMonth}
          className="button-navigation-arrows"
        >
          <span className="material-icons-outlined cursor-pointer text-orange-50 mx-2 headerArrows">
            chevron_right
          </span>
        </button>
        <p className="ml-4 text-black-500 monthTitle">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </p>
        <div className="searchbar">
          <input
            type="text"
            name="text"
            placeholder="Search any course"
            className="input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="dropdown">
              <ul>
                {searchResults.map((result) => (
                  <li key={result.id} onClick={() => handleCourseClick(result)}>
                    <strong>{result.courseName}</strong>
                    <br />
                    Start Date: {result.startProgramDates} End Date:
                    {result.endProgramDates}
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
              closeModal();
            }}
          />
        )}
        <div className="form-group">  
          <select value={selectedDropValue} onChange={handleDropdownChange} className='formControlPractice'>  
            <option value="">Select your practice</option>  
            {renderOptions([...new Set(dropDownData.map(result => result.source))])}
          </select>  
        </div> 
        <div className="form-group">  
          <button className="button-calendar-today">Add events</button> 
        </div> 
      </div>
       
    </header>
  );
};

export default CourseSearch;
