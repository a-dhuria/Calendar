import React, { useState, useEffect } from 'react';   
import AllTheData from './AllTheData/AllTheData'; 
import axios from "axios";
  
const EditAndDelete = () => {  
  const [data, setData] = useState([])  

  useEffect(() => {
    const url = 'https://prod-71.eastus.logic.azure.com/workflows/6cb8572e6795450abd8add7c836c1b43/triggers/When_a_HTTP_request_is_received/paths/invoke/coursecount?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=a7jT-C0mSLtnoNW0U9C-6XYKpyuzxxazLPa_GglJnj8'
    axios.get(url).then(response=> {
      const profileDropDownData = response.data.Table1;
      setData(profileDropDownData);
    })
  },[])
  
  return (  
    <div>  
      <AllTheData data={data} />  
    </div>  
  );  
};  
  
export default EditAndDelete;  
