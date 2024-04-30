import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import "./UserName.css";

const UserName = () => {
  const { instance } = useMsal();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log("Got under login");
    const currentAccount = instance.getActiveAccount();
    if (currentAccount) {
      console.log(currentAccount);
      setUserName(currentAccount.name);
    }
    console.log("Did not go inside this");
  }, [instance]);

  return (
    <span className="userName">
      {userName ? (
        <p className="userName-para">Welcome, {userName}</p>
      ) : (
        <p></p>
      )}
    </span>
  );
};

export default UserName;
