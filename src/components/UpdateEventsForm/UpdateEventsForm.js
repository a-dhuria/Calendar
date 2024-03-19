import { useState, useEffect } from "react";
import axios from 'axios'
import './UpdateEventsForm.css'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const UpdateEventsForms = () => {
  const [dropDownData, setDropDown] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [source, setSource] = useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [courseName, setCourseName] = useState('');
  const [customFormat, setCustomFormat] = useState('');
  const [selectedTA, setSelectedTA] = useState('');
  const [customTA, setCustomTA] = useState('');
  const [registration, setRegistration] = useState('')
  const [formData, setFormData] = useState([]);

    useEffect(()=>{
        const url = 'https://prod-62.eastus.logic.azure.com/workflows/f40390d3b1fe4001878fec9dc26af2cf/triggers/manual/paths/invoke/allcourseswithstatus?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GrNkiypWxhQE0V55YgxxynDrncq4y89zXnT-M4H0U10'
        axios.get(url).then(response=> {
          const profileDropDownData = response.data.Table1;
          setDropDown(profileDropDownData);
        })
    })

    function renderRandomOptions(unique){
        return unique.map(value=>(
            <option value={value} className="formControlPractice_option">{value}</option>
        ))  
    }

    const handleSourceChange = (event) => {
      setSource(event.target.value)
    }

    const handleStartDate = (event) => {
      let startDate = event.target.value;  
      let parts = startDate.split('-');  
      let convertedDate = parts[2] + '-' + parts[1] + '-' + parts[0];  
      setStartDate(convertedDate);  
      // setStartDate(event.target.value)
    }

    const handleEndDate = (event) => {
      let endDate = event.target.value;  
      let parts = endDate.split('-');  
      let convertedDate = parts[2] + '-' + parts[1] + '-' + parts[0]; 
      setEndDate(convertedDate)
    }

    const handleStartTime = (event) => {
      setStartTime(event.target.value);
    }

    const handleEndTime = (event) => {
      setEndTime(event.target.value);
    }

    const handleCourseName = (event) => {
      setCourseName(event.target.value);
    }

    const handleRegistration = (event) => {
      setRegistration(event.target.value)
    }

   
    const handleFormatChange = (event) => {
        const value = event.target.value;
        setSelectedFormat(value);
        if (value === 'other') {
          setCustomFormat('');
        }
      };
      
    const handleCustomFormatChange = (event) => {
        setCustomFormat(event.target.value);
    };

    const handleTAChange = (event) => {
        const value = event.target.value;
        setSelectedTA(value);
        if (value === 'other') {
          setCustomTA('');
        }
      };
      
    const handleCustomTAChange = (event) => {
        setCustomTA(event.target.value);
    };

    const handleSubmit = (event) => {  
      event.preventDefault();  
      const updatedFormData = {  
        courseCount: 1,
        courseName: courseName,  
        endProgramDates: endDate,  
        endTime: endTime,  
        format: customFormat || selectedFormat,  
        id: 123,
        registrationLink: registration,  
        source: source,  
        startProgramDates: startDate,  
        startTime: startime,
        targetAudience: selectedTA
      };  
      setFormData(updatedFormData);  
      console.log("this is form Data", formData)
      const url = 'https://prod-27.eastus.logic.azure.com/workflows/2ecc76e94d6e481699128b62542793aa/triggers/manual/paths/invoke/events?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=x2lUcardPo3l1znmvWoMsvgWP0nEQWVJydfoeM9fuMg';  
      axios.post(url, formData)
      .then(response => {
        console.log(response.data.Table1);
      })
      .catch(error => {
        console.error(error);
      }); 
    }; 

    return (
        <div className="main">
          <h1 className="form-title">Add New Events</h1>
          <form action="" className="main-form" onSubmit={handleSubmit}>
            <label for="first" className="updateEvents-label">Source</label>
            <input type="text" id="title" name="title" placeholder="Enter your Project Title" required value={source} className="updateEvents-input" onChange={handleSourceChange}/>
            <label for="dob" className="updateEvents-label">Start Program Date</label>
            <input type="date" id="dob" name="dob" placeholder="Enter your PLD" required className="updateEvents-input" defaultValue={startDate} onChange={handleStartDate}/>
            <label for="dob" className="updateEvents-label">End Program Dates</label>
            <input type="date" id="dob" name="dob" placeholder="Enter your PLD" required className="updateEvents-input" defaultValue={endDate} onChange={handleEndDate}/>
            <label for="last" className="updateEvents-label">Start Time</label>
            <input type="text" id="description" name="description" placeholder="Enter Description" required className="updateEvents-input" value={startime} onChange={handleStartTime}/>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['TimePicker', 'TimePicker']}>
                <TimePicker label="Start Time" value={startime} onChange={handleStartTime}/>
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['TimePicker', 'TimePicker']}>
                <TimePicker label="End Time" value={endTime} onChange={handleEndTime}/>
              </DemoContainer>
            </LocalizationProvider> */}
            <label for="last" className="updateEvents-label">End Time</label>
            <input type="text" id="description" name="description" placeholder="Enter Description" required className="updateEvents-input" value={endTime} onChange={handleEndTime}/>
            <label for="last" className="updateEvents-label">Course Name</label>
            <input type="text" id="objectives" name="objectives" placeholder="Learning Objective" required className="updateEvents-input" value={courseName} onChange={handleCourseName}/>
            <label for="Target Audience" className="updateEvents-label">Target Audience​</label>
            <select id="Target Audience" name="Target Audience" value={selectedTA} onChange={handleTAChange} required className="updateEvents-select">
                {renderRandomOptions([...new Set(dropDownData.map(result => result.targetAudience))])}
                <option value="other">Other</option>
            </select>
            {selectedTA === 'other' && (
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
            <label for="Format" className="updateEvents-label">Format</label>
            <select id="Format" name="Format" value={selectedFormat} onChange={handleFormatChange} required className="updateEvents-select">
                {renderRandomOptions([...new Set(dropDownData.map(result => result.format))])}
                <option value="other">Other</option>
            </select>
            {selectedFormat === 'other' && (
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
            <label for="last" className="updateEvents-label">Registration Link</label>
            <input type="text" id="duration" name="duration" placeholder="Enter Duration" required className="updateEvents-input" value={registration} onChange={handleRegistration}/>
            <div className="wrap">
              <button type="submit" onClick={handleSubmit}  className="updateEvents-Button">
                Submit 
              </button>
            </div>
          </form>
      </div>
      )
}

export default UpdateEventsForms;