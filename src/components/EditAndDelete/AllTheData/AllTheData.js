import React, { useEffect, useState } from 'react';  
import './AllTheData.css';
import axios from 'axios';

const AllTheData = ({data}) => {   
  const [searchTerm, setSearchTerm] = useState('');  
  const [filteredData, setFilteredData] = useState([]);  
  const [selectedRows, setSelectedRows] = useState([]);  
  const [dummyData, setDummyData] = useState([
      {id:1, courseName:'Testing1', startDate: '23rd March, 2024', endDate: '25th Match, 2024', format:'VISL', source: 'online'},
      {id:2, courseName:"Testing2", startDate: "25th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'In-Person'},
      {id:3, courseName:"Testing3", startDate: "27th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'online'},
      {id:4, courseName:"Testing4", startDate: "28th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'Live'},
      {id:5, courseName:"Testing5", startDate: "30th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'Live'},
      {id:6, courseName:"Testing6", startDate: "26th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'online'},
      {id:7, courseName:"Testing7", startDate: "27th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'In-Person'},
      {id:8, courseName:"Testing8", startDate: "28th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'online'},
      {id:9, courseName:"Testing9", startDate: "29th March, 2024", endDate: '25th Match, 2024', format:'VISL', source: 'In-Person'},
    ]
  );
  const [editingId, setEditingId] = useState(null);  
  const [editingData, setEditingData] = useState({});  
  const [showDeleteModal, setShowDeleteModal] = useState(false);  
  const [deleteItemId, setDeleteItemId] = useState(null);  

  const handleSearch = (e) => {  
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);  
    if(term === ''){
      setFilteredData(data); 
    } else {
      const filtered = data.filter((item) =>  
        item.name.toLowerCase().includes(term)  
      ); 
      setFilteredData(filtered);  
    }
  };

  useEffect(()=>{
    setFilteredData(data);  
  }, [data])
   
  
  const handleSelectRow = (id) => {  
    if (selectedRows.includes(id)) {  
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));  
    } else {  
      setSelectedRows([...selectedRows, id]);  
    }  
  };  
  
  const handleSubmit = () => {  
    console.log('Selected Rows:', selectedRows); 
    const url = '';
    axios.delete(url, selectedRows)
    .then() 
  };

  const handleEditClick = (id) => {  
    setEditingId(id);  
    const item = dummyData.find((item) => item.id === id);   //Rename dummyData to data once the backend is setup.
    setEditingData(item);
  };  
  
  const handleInputChange = (id, field, value) => {   //Editing the values
    console.log("Lets see", id, field, value)
    const updatedData = dummyData.map((item) => {   //Rename dummyData to data once the backend is setup.
      console.log(item)
      if (item.id === id) {  
        return { ...item, [field]: value };  
      }  
      return item;  
    });  
    console.log("The edited version is here", updatedData)
    setDummyData(updatedData);  
  };  

  const handleCancelEdit = () => {  
    setEditingId(null);  
    setEditingData({});  
    setDummyData(dummyData);
  }; 

  const handleDelete = (id) => {  
    setShowDeleteModal(true);  
    setDeleteItemId(id); 
  }; 

  const confirmDelete = () => {  
    const updatedData = dummyData.filter((item) => item.id !== deleteItemId);  
    setDummyData(updatedData);  
    setShowDeleteModal(false);  
    setDeleteItemId(null);  
  };

  const handleSaveClick = (id) => {  
    setEditingId(null);  
  };  
  
  return (  
    <div className='table'> 
      <div className='table-searchSort'>
        <input  
            type="text"  
            placeholder="Search..."  
            value={searchTerm}  
            onChange={handleSearch}  
            className='input edit-input'
        />  
      </div> 
      <div className="allEventsDataTable">
        <table className='fl-table' id='style-3'>  
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
          {dummyData.map((item) => (
            <tr key={item.id}>  
            <td>  
              <input  
                type="checkbox"  
                checked={selectedRows.includes(item.id)}  
                onChange={() => handleSelectRow(item.id)}  
              />  
            </td>   
            <td>  
              {editingId === item.id ? (  
                <input  
                  type="text"  
                  value={item.courseName}  
                  onChange={(e) => handleInputChange(item.id, 'courseName', e.target.value)}  
                />  
              ) : (  
                item.courseName 
              )}  
            </td>
            <td>  
              {editingId === item.id ? (  
                <input  
                  type="text"  
                  value={item.startDate}  
                  onChange={(e) => handleInputChange(item.id, 'startDate', e.target.value)}  
                />  
              ) : (  
                item.startDate 
              )}  
            </td>
            <td>  
              {editingId === item.id ? (  
                <input  
                  type="text"  
                  value={item.endDate}  
                  onChange={(e) => handleInputChange(item.id, 'endDate', e.target.value)}  
                />  
              ) : (  
                item.endDate 
              )}  
            </td>
            <td>  
              {editingId === item.id ? (  
                <input  
                  type="text"  
                  value={item.format}  
                  onChange={(e) => handleInputChange(item.id, 'format', e.target.value)}  
                />  
              ) : (  
                item.format 
              )}  
            </td>
            <td>  
              {editingId === item.id ? (  
                <input  
                  type="text"  
                  value={item.source}  
                  onChange={(e) => handleInputChange(item.id, 'source', e.target.value)}  
                />  
              ) : (  
                item.source 
              )}  
            </td>
            <td>  
              {editingId === item.id ? (  
                <>
                  <button onClick={() => handleSaveClick(item.id)} className="eventsModalOpenClickButton">Save</button> 
                  <button onClick={handleCancelEdit} className="eventsModalOpenClickButton">Cancel</button>  
                </>
              ) : (  
                <>
                  <button onClick={() => handleEditClick(item.id)} className="eventsModalOpenClickButton">Edit</button>  
                  <button onClick={(e) => handleDelete(item.id)} className="eventsModalOpenClickButton">Delete</button>  
                </>
              )}  
            </td> 
          </tr> 
          ))}
          </tbody>  
        </table> 
        {showDeleteModal && (  
          <div className="modal">  
            <div className="modal-content">  
              <h3>Confirm Delete</h3>  
              <p>Are you sure you want to delete this record?</p>  
              <div className="modal-actions">  
                <button onClick={confirmDelete}  className="eventsModalOpenClickButton">Yes</button>  
                <button onClick={() => setShowDeleteModal(false)}  className="eventsModalOpenClickButton">No</button>  
              </div>  
            </div>  
          </div>  
        )}     
      </div> 
      {selectedRows.length > 0 && (  
        <button onClick={handleSubmit} className='table_buttons'>Submit</button>  
      )} 
    </div>  
  );  
};  
  
export default AllTheData;  
