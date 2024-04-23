import './UpdateEventsForm.css'
import Banner from "../../CalendarHeader/Banner/Banner";
import SingleUpdate from './SingleUpdate/SingleUpdate';
import BulkUpdate from './BulkUpdate/BulkUpdate';

const UpdateEventsForms = () => {
    return (
      <div className="main">
        <Banner term={"Home"} admin="Admin Page" />
        <div className='main-section'>
          <SingleUpdate />
          <BulkUpdate/>
        </div>
      </div>
      )
}

export default UpdateEventsForms;