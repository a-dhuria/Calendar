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

      const response = await fetch("http://localhost:4000/enroll", {
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
        <button className="close" onClick={handleClose}>
        &#10006;
      </button>
      </div>
    </section>
  );
};

export default RegistrationForm;
