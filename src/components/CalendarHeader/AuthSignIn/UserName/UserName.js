import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import "./UserName.css";

const UserName = () => {
  const { instance } = useMsal();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const currentAccount = instance.getActiveAccount();
    if (currentAccount) {
      setUserName(currentAccount.name);
    }
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
