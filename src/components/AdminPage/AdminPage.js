import { useNavigate } from "react-router-dom";
import "./AdminPage.css";
import Banner from "../CalendarHeader/Banner/Banner";
import NotAdminPage from "../CalendarHeader/ErrorPages/NotAdminPage";
import NotLoggedInPage from "../CalendarHeader/ErrorPages/NotLoggedInPage";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

const AdminPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const navigate = useNavigate();

  const isAdmin = () => {
    const user = accounts[0];
    if (user.idTokenClaims.roles) {
      return user.idTokenClaims.roles.includes("admin");
    } else {
      return false;
    }
  };
  return (
    <div>
      <Banner home="Home" />
      {isAuthenticated ? (
        isAdmin() ? (
          <div className="adminPage">
            <div
              className="adminPage_adding"
              onClick={() => navigate("/addEvents")}
            >
              <p className="adminPage_para">Add Events</p>
            </div>
            <div
              className="adminPage_editdelete"
              onClick={() => navigate("/editdeletedata")}
            >
              <p className="adminPage_para">Edit or Delete Events</p>
            </div>
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

export default AdminPage;
