import { createContext, useState } from "react";
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [daySelected, setDaySelected] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [selectedDropValue, setSelectedDropValue] = useState("");
  const [siteData, setSiteData] = useState([]);

  const contextValue = {
    showComponent,
    setShowComponent,
    daySelected,
    setDaySelected,
    showEventModal,
    setShowEventModal,
    filteredEvents,
    setFilteredEvents,
    selectedDropValue,
    setSelectedDropValue,
    siteData,
    setSiteData,
  };

  return (
    <GlobalContext.Provider value={{ contextValue }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
