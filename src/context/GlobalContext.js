// GlobalContext.js
import { createContext, useState, useEffect } from "react";
const GlobalContext = createContext();
 
export const GlobalProvider = ({ children }) => {
  const [daySelected, setDaySelected] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showComponent, setShowComponent] = useState(false); 

  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(`http://localhost:4000/courses-count-by-date`);
      const data = await response.json();
      console.log(data)
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };
 
  // Fetch data on component mount
  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const contextValue = {
    showComponent,
    setShowComponent,
    daySelected,
    setDaySelected,
    showEventModal,
    setShowEventModal,
    filteredEvents,
    setFilteredEvents,
  };
 
  return (
    <GlobalContext.Provider value={{ contextValue}}>
      {children}
    </GlobalContext.Provider>
  );
};
 
export default GlobalContext;
 