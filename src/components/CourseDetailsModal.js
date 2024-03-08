import ModalContainer from "./Modalcontainer";
import "./CourseDetailsModal.css"

const CourseDetailsModal = ({ courseDetails, onClose, onApplyClick }) => {
    const handleApplyClick = (url) => {
      onClose();
      onApplyClick();
      if(url){
        window.location.href = url;  
      } 
    };

    function RedirectToPage(url) { 
      if(url){
        window.location.href = url;  
      } 
    }  
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="course-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <ModalContainer onClose={()=>handleApplyClick()}>
              <h2 className="courseDetailTitle">{courseDetails.courseName}</h2>
              <table className="course-details-table">
                <tbody>
                  <tr>
                    <td>Source:</td>
                    <td>{courseDetails.source}</td>
                  </tr>
                  <tr>
                    <td>Start Program Dates:</td>
                    <td>{courseDetails.startProgramDates}</td>
                  </tr>
                  <tr>
                    <td>End Program Dates:</td>
                    <td>{courseDetails.endProgramDates}</td>
                  </tr>
                  <tr>
                    <td>Start Time:</td>
                    <td>{courseDetails.startTime}</td>
                  </tr>
                  <tr>
                    <td>End Time:</td>
                    <td>{courseDetails.endTime}</td>
                  </tr>
                  <tr>
                    <td>Target Audience:</td>
                    <td>{courseDetails.targetAudience}</td>
                  </tr>
                  <tr>
                    <td>Format:</td>
                    <td>{courseDetails.format}</td>
                  </tr>
                </tbody>
              </table>
              {courseDetails.registrationLink ? (
                <button onClick={()=>RedirectToPage(courseDetails.registrationLink)} className="apply-button">Apply</button>
              ):(
                <button onClick={handleApplyClick} className="apply-button">TBD</button>
              )}

            </ModalContainer>
            
            
          </div>
        </div>
      </div>
    );
};


export default CourseDetailsModal