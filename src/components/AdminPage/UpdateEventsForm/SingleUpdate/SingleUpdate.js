import { useState, useEffect } from "react";
import axios from "axios";
import "./SingleUpdate.css";
import SuccessUpload from "../../SuccessUpload/SuccessUpload";
import FailedUpload from "../../FailedUpload/FailedUpload";

const SingleUpdate = () => {
  const [dropDownData, setDropDown] = useState([]);
  const [source, setSource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [courseName, setCourseName] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [customFormat, setCustomFormat] = useState("");
  const [selectedTA, setSelectedTA] = useState("");
  const [customTA, setCustomTA] = useState("");
  const [selectedPractice, setSelectedPractice] = useState("");
  const [customPractice, setCustomPractice] = useState("");
  const [registration, setRegistration] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  useEffect(() => {
    const url =
      "https://prod-33.eastus.logic.azure.com/workflows/5ecb6d8f908e4752991c3c23e16e39c5/triggers/When_a_HTTP_request_is_received/paths/invoke/allcourseswithstatus?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=YXSyfVCQ_CiACJRuAages-B-rTvCBsAadMFFTnN-FXY";
    axios.get(url).then((response) => {
      const profileDropDownData = response.data.Table1;
      setDropDown(profileDropDownData);
    });
  });

  function renderRandomOptions(unique) {
    return unique.map((value) => (
      <option value={value} className="formControlPractice_option">
        {value}
      </option>
    ));
  }

  const handleSourceChange = (event) => {
    setSource(event.target.value);
  };

  const handleStartDate = (event) => {
    let startDate = event.target.value;
    let parts = startDate.split("-");
    let convertedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    setStartDate(convertedDate);
  };

  const handleEndDate = (event) => {
    let endDate = event.target.value;
    let parts = endDate.split("-");
    let convertedDate = parts[2] + "-" + parts[1] + "-" + parts[0];
    setEndDate(convertedDate);
  };

  const handleStartTime = (event) => {
    setStartTime(event.target.value);
  };

  const handlePracticeChange = (event) => {
    setSelectedPractice(event.target.value);
  };

  const handleEndTime = (event) => {
    setEndTime(event.target.value);
  };

  const handleCourseName = (event) => {
    setCourseName(event.target.value);
  };

  const handleRegistration = (event) => {
    setRegistration(event.target.value);
  };

  const handleFormatChange = (event) => {
    const value = event.target.value;
    setSelectedFormat(value);
    if (value === "other") {
      setCustomFormat("");
    }
  };

  const handleCustomFormatChange = (event) => {
    setCustomFormat(event.target.value);
  };

  const handleTAChange = (event) => {
    const value = event.target.value;
    setSelectedTA(value);
    if (value === "other") {
      setCustomTA("");
    }
  };

  const handleCustomPracticeChange = (event) => {
    setCustomPractice(event.target.value);
  };

  const handleCustomTAChange = (event) => {
    setCustomTA(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFormData = [
      {
        courseName: courseName,
        endProgramDates: endDate,
        endTime: endTime,
        format: customFormat || selectedFormat,
        registrationLink: registration,
        source: source,
        startProgramDates: startDate,
        startTime: startime,
        targetAudience: selectedTA,
        practice: selectedPractice,
      },
    ];
    const url =
      "https://prod-59.eastus.logic.azure.com/workflows/86e398e797a043a68664d2a13ec4c2e2/triggers/When_a_HTTP_request_is_received/paths/invoke/events?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=vwYw-4krIQFLmT7EQJPxjCfaVf5_Yx0hCaBRq4LN0pE";
    axios
      .post(url, updatedFormData)
      .then((response) => {
        setSource("");
        setStartDate("");
        setEndDate("");
        setStartTime(0);
        setEndTime(0);
        setCourseName("");
        setSelectedFormat("");
        setCustomFormat("");
        setSelectedTA("");
        setCustomTA("");
        setSelectedPractice("");
        setCustomPractice("");
        setRegistration("");
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setShowFailModal(true);
        setTimeout(() => {
          setShowFailModal(false);
        }, 3000);
      });
  };

  return (
    <div className="singleUpdate">
      <h1 className="form-title">Add New Events</h1>
      <form action="" className="main-form" onSubmit={handleSubmit}>
        <label for="first" className="updateEvents-label">
          Source
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter Source Name"
          required
          value={source}
          className="updateEvents-input"
          onChange={handleSourceChange}
        />
        <label for="dob" className="updateEvents-label">
          Start Program Date
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          placeholder="Enter your PLD"
          required
          className="updateEvents-input"
          defaultValue={startDate}
          onChange={handleStartDate}
        />
        <label for="dob" className="updateEvents-label">
          End Program Dates
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          placeholder="Enter your PLD"
          required
          className="updateEvents-input"
          defaultValue={endDate}
          onChange={handleEndDate}
        />
        <label for="last" className="updateEvents-label">
          Start Time
        </label>
        <input
          type="time"
          id="description"
          name="description"
          placeholder="Enter Description"
          required
          className="updateEvents-input"
          value={startime}
          onChange={handleStartTime}
        />
        <label for="last" className="updateEvents-label">
          End Time
        </label>
        <input
          type="time"
          id="description"
          name="description"
          placeholder="Enter Description"
          required
          className="updateEvents-input"
          value={endTime}
          onChange={handleEndTime}
        />
        <label for="last" className="updateEvents-label">
          Course Name
        </label>
        <input
          type="text"
          id="objectives"
          name="objectives"
          placeholder="Course Name"
          required
          className="updateEvents-input"
          value={courseName}
          onChange={handleCourseName}
        />
        <label for="Target Audience" className="updateEvents-label">
          Target Audience​
        </label>
        <select
          id="Target Audience"
          name="Target Audience"
          value={selectedTA}
          onChange={handleTAChange}
          required
          className="updateEvents-select"
        >
          {renderRandomOptions([
            ...new Set(dropDownData.map((result) => result.targetAudience)),
          ])}
          <option value="other">Other</option>
        </select>
        {selectedTA === "other" && (
          <input
            type="text"
            id="otherTA"
            name="otherTA"
            placeholder="Enter your own Target Audience"
            value={customTA}
            onChange={handleCustomTAChange}
            required
            className="updateEvents-input"
          />
        )}
        <label for="Format" className="updateEvents-label">
          Format
        </label>
        <select
          id="Format"
          name="Format"
          value={selectedFormat}
          onChange={handleFormatChange}
          required
          className="updateEvents-select"
        >
          {renderRandomOptions([
            ...new Set(dropDownData.map((result) => result.format)),
          ])}
          <option value="other">Other</option>
        </select>
        {selectedFormat === "other" && (
          <input
            type="text"
            id="otherFormat"
            name="otherFormat"
            placeholder="Enter your own format"
            value={customFormat}
            onChange={handleCustomFormatChange}
            required
            className="updateEvents-input"
          />
        )}
        <label for="Practice" className="updateEvents-label">
          Practice​
        </label>
        <select
          id="Practice"
          name="Practice"
          value={selectedPractice}
          onChange={handlePracticeChange}
          required
          className="updateEvents-select"
        >
          {renderRandomOptions([
            ...new Set(dropDownData.map((result) => result.practice)),
          ])}
          <option value="other">Other</option>
        </select>
        {selectedPractice === "other" && (
          <input
            type="text"
            id="otherPractice"
            name="otherPractice"
            placeholder="Enter your own Practice Type"
            value={customPractice}
            onChange={handleCustomPracticeChange}
            required
            className="updateEvents-input"
          />
        )}
        <label for="last" className="updateEvents-label">
          Registration Link
        </label>
        <input
          type="url"
          id="duration"
          name="duration"
          placeholder="Enter the Link"
          required
          className="updateEvents-input"
          value={registration}
          onChange={handleRegistration}
        />
        <div className="wrap">
          <button type="submit" className="updateEvents-Button">
            Submit
          </button>
        </div>
      </form>
      {showSuccessModal && <SuccessUpload />}
      {showFailModal && <FailedUpload />}
    </div>
  );
};

export default SingleUpdate;
