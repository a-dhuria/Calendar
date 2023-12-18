// eslint-disable-next-line no-unused-vars
import { info } from "autoprefixer"
import { useState } from "react"
import {utils,read} from 'xlsx'
const ImportExcel=()=>
{
    const [excelData,setExcelData]=useState([])
    const file_type=['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    const handleChange=(e)=>
    {
        const selected_file=e.target.files[0] ;
        if(selected_file){
            if(selected_file && file_type.includes(selected_file.type))
            {
                let reader=new FileReader();
                reader.onload=(e)=>
                {
                    const workbook=read(e.target.result);
                    const sheet=workbook.SheetNames;
                    if(sheet.length)
                    {
                        const data=utils.sheet_to_json(workbook.Sheets[sheet[0]]);
                        setExcelData(data);
                     }
                }
                reader.readAsArrayBuffer(selected_file)
            }
            else{
                console.log('Only Excel File')

            }
        }
        
    }
    return(
        <div className="justify-center item-center flex-col">
    <div>
        <input type='file'
        onChange={handleChange} 
    />
    </div>

    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th> Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {
    excelData.length
?
            excelData.map((info)=>(
                <tr>
                    <td>{info.ID}</td>
                    <td>{info.Name}</td>
                    <td>{info.Email}</td>
                </tr>
             ) )
:
                <tr>No user data is present</tr>

            }
            </tbody>
        </table>
    </div>


        </div>
    )
}
export default ImportExcel