import { createContext, useState } from "react";
 
const GlobalContext = createContext();
 
export const GlobalProvider = ({ children }) => {
  const [daySelected, setDaySelected] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]); // Assuming you have a filteredEvents state
 
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
      const response = await fetch('http://localhost:4000/courses-count-by-date'); // Assuming this is your backend endpoint
      const data = await response.json();
      setFilteredEvents(data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };
 
  return (
<GlobalContext.Provider value={{contextValue,filteredEvents,
        fetchDataFromBackend}}>
      {children}
</GlobalContext.Provider>
  );
};
 
export default GlobalContext;