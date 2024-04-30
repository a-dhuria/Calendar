import "./UpdateEventsForm.css";
import Banner from "../../CalendarHeader/Banner/Banner";
import SingleUpdate from "./SingleUpdate/SingleUpdate";
import BulkUpdate from "./BulkUpdate/BulkUpdate";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import NotLoggedInPage from "../../CalendarHeader/ErrorPages/NotLoggedInPage";
import NotAdminPage from "../../CalendarHeader/ErrorPages/NotAdminPage";

const UpdateEventsForms = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const isAdmin = () => {
    const user = accounts[0];
    if (user.idTokenClaims.roles) {
      return user.idTokenClaims.roles.includes("admin");
    } else {
      return false;
    }
  };
  return (
    <div className="main">
      <Banner home={"Home"} admin="Admin Page" />
      {isAuthenticated ? (
        isAdmin() ? (
          <div className="main-section">
            <SingleUpdate />
            <BulkUpdate />
          </div>
        ) : (
          <NotAdminPage />
        )
      ) : (
        <NotLoggedInPage />
      )}
    </div>
  );
};

export default UpdateEventsForms;
