import React, { useState, useEffect } from 'react';   
import AllTheData from './AllTheData/AllTheData'; 
import axios from "axios";
  
const EditAndDelete = () => {  
  const [data, setData] = useState([])  

  useEffect(()=>{
    const url = 'https://prod-62.eastus.logic.azure.com/workflows/53708f33e38142e1b3b56df534a9b5d0/triggers/manual/paths/invoke/coursecountbydate?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AgIJRP4YoKcWhQ0lF6RMwuGA1--wYQizRu6ZUxFPEsw'
    axios.get(url).then(response=> {
      const profileDropDownData = response.data.Table1;
      setData(profileDropDownData);
    })
})
  
  return (  
    <div>  
      {console.log(data)}
      <AllTheData data={data} />  
    </div>  
  );  
};  
  
export default EditAndDelete;  
