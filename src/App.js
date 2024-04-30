import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getMonth } from "./util";
import CalendarHeader from "./components/CalendarHeader/CalendarHeader";
import Sidebar from "./components/SideBar/Sidebar";
import Month from "./components/Month/Month";
import GlobalContext from "./Context/GlobalContext";
import EventModal from "./components/EventModal/EventModal";
import UpdateEventsForms from "../src/components/AdminPage/UpdateEventsForm/UpdateEventsForm";
import EditAndDelete from "../src/components/AdminPage/EditAndDelete/EditAndDelete";
import AdminPage from "./components/AdminPage/AdminPage";
import {
  MsalProvider,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import msalConfig from "../src/components/CalendarHeader/msalConfig/msalConfig";

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    console.log(event);
    msalInstance.setActiveAccount(event.payload.account);
  }
});

function App() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex } = useContext(GlobalContext);
  const { accounts } = useMsal();
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);

  useEffect(() => {
    const account = accounts[0];
    setUser(account);
  }, [accounts]);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <Router>
      <MsalProvider instance={msalInstance}>
        <UnauthenticatedTemplate>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <React.Fragment>
                  <div className="overall">
                    <CalendarHeader />
                    <div className="main-content-area">
                      <Sidebar />
                      <Month month={currentMonth} />
                      <EventModal />
                    </div>
                  </div>
                </React.Fragment>
              }
            ></Route>
            <Route
              exact
              path="/addEvents"
              element={<UpdateEventsForms />}
            ></Route>
            <Route
              exact
              path="/editdeletedata"
              element={<EditAndDelete />}
            ></Route>
            <Route exact path="/adminPage" element={<AdminPage />}></Route>
          </Routes>
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <React.Fragment>
                  <div className="overall">
                    <CalendarHeader />
                    <div className="main-content-area">
                      <Sidebar />
                      <Month month={currentMonth} />
                      <EventModal />
                    </div>
                  </div>
                </React.Fragment>
              }
            ></Route>
            <Route
              exact
              path="/addEvents"
              element={<UpdateEventsForms />}
            ></Route>
            <Route
              exact
              path="/editdeletedata"
              element={<EditAndDelete />}
            ></Route>
            <Route exact path="/adminPage" element={<AdminPage />}></Route>
          </Routes>
        </AuthenticatedTemplate>
      </MsalProvider>
    </Router>
  );
}

export default App;
