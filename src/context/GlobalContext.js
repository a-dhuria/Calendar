// GlobalContext.js
import { createContext, useState, useEffect } from "react";
 
const GlobalContext = createContext();
 
export const GlobalProvider = ({ children }) => {
  const [daySelected, setDaySelected] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
 
  const contextValue = {
    daySelected,
    setDaySelected,
    showEventModal,
    setShowEventModal,
    filteredEvents,
    setFilteredEvents,
  };
 
  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:4000/courses-count-by-date');
      const data = await response.json();
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };
 
  // Fetch data on component mount
  useEffect(() => {
    fetchDataFromBackend();
  }, []);
 
  return (
    <GlobalContext.Provider value={{ contextValue, fetchDataFromBackend }}>
      {children}
    </GlobalContext.Provider>
  );
};
 
export default GlobalContext;
 