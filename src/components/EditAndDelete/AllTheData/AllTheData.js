import React, { useEffect, useState } from 'react';  
import { useNavigate } from "react-router-dom"
import './AllTheData.css';

const AllTheData = ({data}) => {   
  const [searchTerm, setSearchTerm] = useState('');  
  const [filteredData, setFilteredData] = useState([]);  
  const [selectedRows, setSelectedRows] = useState([]);  
  const navigate = useNavigate();
  const handleSearch = (e) => {  
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);  
    if(term === ''){
      setFilteredData(data); 
    console.log(filteredData, "Aht the top")

    } else {
      const filtered = data.filter((item) =>  
        item.name.toLowerCase().includes(term)  
      ); 
      setFilteredData(filtered);  
    }
  };

  useEffect(()=>{
    setFilteredData(data);  
  })
   
  
  const handleSelectRow = (id) => {  
    if (selectedRows.includes(id)) {  
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));  
    } else {  
      setSelectedRows([...selectedRows, id]);  
    }  
  };  
  
  const handleSubmit = () => {  
    console.log('Selected Rows:', selectedRows);  
  };
  
  return (  
    <div className='table'> 
      <div className='table-searchSort'>
        <input  
            type="text"  
            placeholder="Search..."  
            value={searchTerm}  
            onChange={handleSearch}  
            className='table-searchBox'
        />  
      </div>  
      <table className='mainTable'>  
        <thead className='mainTable_header'>  
          <tr>  
            <th>ID</th> 
            <th>Course Name</th>  
            <th>Start Date</th>  
            <th>End Date</th>   
            <th>Format</th>  
            <th>Source</th>    
          </tr>  
        </thead>  
        <tbody className='mainTable_body'>  
          {console.log("This is at", filteredData)}
          {filteredData.map((item) => (  
            <tr key={item.id}>  
              <td>  
                <input  
                  type="checkbox"  
                  checked={selectedRows.includes(item.id)}  
                  onChange={() => handleSelectRow(item.id)}  
                />  
              </td>  
              <td>{item.courseName}</td>  
              <td>{item.startProgramDates}</td>  
              <td>{item.endProgramDates}</td>  
              <td>{item.format}</td>  
              <td>{item.source}</td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
      {selectedRows.length > 0 && (  
        <button onClick={handleSubmit} className='table_buttons'>Submit</button>  
      )} 
    </div>  
  );  
};  
  
export default AllTheData;  
