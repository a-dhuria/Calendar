import { useNavigate } from "react-router-dom"
import './AdminPage.css'
import Banner from "../CalendarHeader/Banner/Banner";

const AdminPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Banner term="Home"/>
            <div className="adminPage">
                <div className="adminPage_adding" onClick={() => navigate("/addEvents")}>  
                    <p className="adminPage_para">Add Events</p>
                </div> 
                <div className="adminPage_editdelete" onClick={() => navigate("/editdeletedata")}>  
                    <p className="adminPage_para">Edit or Delete Events</p>
                </div> 
            </div>
        </div>
        
        
    )
}

export default AdminPage;