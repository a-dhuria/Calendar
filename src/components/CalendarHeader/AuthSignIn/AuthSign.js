import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';  
import { useNavigate } from "react-router-dom"
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import AdminPage from '../../AdminPage/AdminPage';
import {useIsAuthenticated} from '@azure/msal-react';
import UserName from './UserName/UserName'


const AuthSign = () => {  
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { instance } = useMsal();  
    
    const handleLogin = () => {  
        //instance.loginPopup();  //This is for the previous technique
        instance.loginRedirect({
            scopes: ['user.read']
        });
    }  
  
    return (  
        <>  
            {isAuthenticated ?
                <button className="button-calendar-today" onClick={() => navigate("/adminPage")}>Admin Access</button> 
                :
                <button className="button-calendar-today" onClick={handleLogin}>Admin Login</button>
            }
            <UserName/>
        </> 
        // <>
        //     <AuthenticatedTemplate>
        //          <button className="button-calendar-today" onClick={() => navigate("/adminPage")}>Admin Access</button> 
        //     </AuthenticatedTemplate>
        //     <UnauthenticatedTemplate>
        //         <button className="button-calendar-today" onClick={handleLogin}>Admin Login</button>
        //     </UnauthenticatedTemplate>
        // </> 
    );  
}  
  
export default AuthSign;  
