import React from 'react';  

const Row = (props) => {  
    return (  
      <tr className='formBody_tr'>  
        <td className="formBody_tr_td">{props.employee.courseName}</td>  
        <td className="formBody_tr_td">{props.employee.startProgramDates}</td>
        <td className="formBody_tr_td">{props.employee.endProgramDates}</td>  
        <td className="formBody_tr_td">{props.employee.status}</td>  
      </tr>  
    );  
};

export default Row