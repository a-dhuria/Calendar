import "./BulkUpdate.css";
import * as XLSX from "xlsx";
import axios from "axios";
import { useState } from "react";
import SuccessUpload from "../../SuccessUpload/SuccessUpload";
import FailedUpload from "../../FailedUpload/FailedUpload";

const BulkUpdate = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);

  const handleFileUpload = (event) => {
    console.log("Entered");
    const file = event.target.files[0];
    console.log(file);
    const url =
      "https://prod-59.eastus.logic.azure.com/workflows/86e398e797a043a68664d2a13ec4c2e2/triggers/When_a_HTTP_request_is_received/paths/invoke/events?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=vwYw-4krIQFLmT7EQJPxjCfaVf5_Yx0hCaBRq4LN0pE";
    if (file) {
      const reader = new FileReader();
      console.log("Yes");
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const jsonData = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        console.log("This is the bulk dummy data we have to upload", jsonData);
        axios
          .post(url, jsonData)
          .then((response) => {
            console.log(response);
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
            }, 3000);
          })
          .catch((error) => {
            console.error(error);
            setShowFailModal(true);
            setTimeout(() => {
              setShowFailModal(false);
            }, 3000);
          });
      };
      reader.onerror = (event) => {
        console.error(
          "File could not be read! Code " + event.target.error.code
        );
      };
    }
  };

  return (
    <div className="bulkUpdate">
      <p>Click here to Upload in bulk</p>
      <input type="file" onChange={handleFileUpload} />
      {showSuccessModal && <SuccessUpload />}
      {showFailModal && <FailedUpload />}
    </div>
  );
};

export default BulkUpdate;
