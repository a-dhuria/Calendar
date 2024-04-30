import { useMsal } from '@azure/msal-react';  
import { useNavigate } from "react-router-dom";  
import { useIsAuthenticated } from '@azure/msal-react';  
import UserName from './UserName/UserName';  
  
const AuthSign = () => {  
  const isAuthenticated = useIsAuthenticated();  
  const navigate = useNavigate();  
  const { instance, accounts } = useMsal();  
  
  const handleLogin = () => {  
    instance.loginRedirect({  
      scopes: ['user.read']  
    });  
  }  
  
  const isAdmin = () => {  
    const user = accounts[0];  
    if(user.idTokenClaims.roles){
      return user.idTokenClaims.roles.includes('admin');  
    }else{
      return false;
    }
  }  
  
  return (  
    <>  
      {isAuthenticated ? (  
        isAdmin() ? (  
          <button className="button-calendar-today" onClick={() => navigate("/adminPage")}>Admin Access</button>  
        ) : (  
          null 
        )  
      ) : (  
        <button className="button-calendar-today" onClick={handleLogin}>Login</button>  
      )}  
      <UserName />  
    </>  
  );  
}  
  
export default AuthSign;  
