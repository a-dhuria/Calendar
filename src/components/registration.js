import React, { useState } from "react";
 
import './registration.css';
 
const RegistrationForm = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    //practiceName:"",
  });
  const [errorMessage, setErrorMessage] = useState("");
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorMessage("");
  };
 
  const handleClose = () => {
    onClose();
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!formData.email.endsWith("@pwc.com")) {
      setErrorMessage("Email must end with @pwc.com");
      return;
    }
 
    try {
      const data = {
        email: formData.email,
        practiceName: formData.practiceName,
        source: event.source,
        startProgramDates: event.startProgramDates,
        endProgramDates: event.endProgramDates,
        startTime: event.startTime,
        endTime: event.endTime,
        courseName: event.courseName,
        targetAudience: event.targetAudience,
        format: event.format,
      };
 
      const response = await fetch("https://prod-60.eastus.logic.azure.com:443/workflows/8564ed5034fd4116b5f0078f44d31c57/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Lq_hk3IRceXObWRXHNvrJTLCPf6ns6Ha0FQdKJQ-nfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
 
      if (response.ok) {
        const result = await response.json();
        console.log(result); // log the response from the server
        // Optionally, you can handle success or navigate to another page
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
 
    onClose();
  };
 
  return (
    <section className="form-section">
      <div className="form-wrapper">
        <h1 className="title">Sign up</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <span className="sr-only">Email address</span>
              <input
                type="email"
                placeholder="Email"
                className="form-input"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
 
          {/* <div className="form-group">
              <label>
                <span className="sr-only">Practice Name</span>
                <select
                  className="form-input"
                  name="practiceName"
                  value={formData.practiceName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Practice Name</option>
                  <option value="Salesforce">Salesforce</option>
                  <option value="SAP">SAP</option>
                  <option value="AWS">AWS</option>
                </select>
              </label>
            </div> */}
 
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
 
          <div className="form-group">
            <input type="submit" value="Submit" className="form-submit" />
          </div>
        </form>
 
        {/* Close button */}
        {/* <button className="close" onClick={handleClose}>
        &#10006;
      </button> */}
      </div>
    </section>
  );
};
 
export default RegistrationForm;