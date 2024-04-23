import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';  
import React, { useState, useEffect } from "react";


const UserName = () => {
    const {instance} = useMsal();
    const [userName, setUserName] = useState('');

    useEffect(()=>{
        console.log("Got under login")
        const currentAccount = instance.getActiveAccount();
        if(currentAccount){
            console.log(currentAccount)
            setUserName(currentAccount.username);
        }
        console.log("Did not go inside this")
    },[instance])

    return (
        <span>
            {userName ? <p>Welcome to the site, {userName}</p> : <p></p>}
        </span>   
        
    );
}

export default UserName