import React, { useEffect, useState } from "react";
import "./AllTheData.css";
import axios from "axios";
import Banner from "../../../CalendarHeader/Banner/Banner";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import NotAdminPage from "../../../CalendarHeader/ErrorPages/NotAdminPage";
import NotLoggedInPage from "../../../CalendarHeader/ErrorPages/NotLoggedInPage";
import DeleteSuccess from "./DeleteSuccess/DeleteSuccess";
import DeleteFail from "./DeleteFail/DeleteFail";

const AllTheData = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [setEditingData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showDeleteFailModal, setShowDeleteFailModal] = useState(false);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) =>
        item.courseName.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSubmit = () => {
    const url = "";
    axios.delete(url, selectedRows).then();
  };

  const handleEditClick = (id) => {
    setEditingId(id);
  };

  const confirmEdit = () => {
    const item = filteredData.find((item) => item.id === editingId);
    const url =
      "https://prod-80.eastus.logic.azure.com/workflows/38eac98bf71547b1be05f1b19f5451ec/triggers/When_a_HTTP_request_is_received/paths/invoke/events?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=HCGkChIeZk-e2xK77a6SnVc99S2wpoEBRyKpUEE7wKg";
    axios
      .post(url, item)
      .then((response) => {
        console.log("Successfully Edited");
      })
      .catch((error) => {
        console.error(error);
      });
    setEditingId(null);
  };

  const handleInputChange = (id, field, value) => {
    //Editing the values
    const updatedData = filteredData.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setFilteredData(updatedData);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
    setFilteredData(filteredData);
  };

  const handleDelete = (id) => {
    setShowDeleteModal(true);
    setDeleteItemId(id);
  };

  const confirmDelete = () => {
    const updatedData = filteredData.filter((item) => item.id === deleteItemId);
    const url =
      "https://prod-83.eastus.logic.azure.com/workflows/5a6369569bdb4b018530ea2903703085/triggers/When_a_HTTP_request_is_received/paths/invoke/deleteevents?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=O0kyq0aXyLPyRVmljfvVfmakMe94pKYNkyekm12AB0A";
    axios
      .post(url, updatedData[0])
      .then((response) => {
        console.log("Successfully Deleted");
        setShowDeleteSuccessModal(true);
        setTimeout(() => {
          setShowDeleteSuccessModal(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
        setShowDeleteFailModal(true);
        setTimeout(() => {
          setShowDeleteFailModal(false);
        }, 3000);
      });
    setShowDeleteModal(false);
    setDeleteItemId(null);
  };

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
    <div className="table">
      <Banner home={"Home"} admin="Admin Page" />
      {isAuthenticated ? (
        isAdmin() ? (
          <div>
            <div className="table-searchSort">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="input edit-input"
              />
            </div>
            <div className="allEventsDataTable">
              <table className="fl-table" id="style-3">
                <thead className="mainTable_header">
                  <tr>
                    <th>Course Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Format</th>
                    <th>Practice</th>
                    <th>Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="mainTable_body">
                  {filteredData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={item.courseName}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "courseName",
                                e.target.value
                              )
                            }
                            className="mainTable-input"
                          />
                        ) : (
                          item.courseName
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={item.startProgramDates}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "startProgramDates",
                                e.target.value
                              )
                            }
                            className="mainTable-input"
                          />
                        ) : (
                          item.startProgramDates
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={item.endProgramDates}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "endProgramDates",
                                e.target.value
                              )
                            }
                            className="mainTable-input"
                          />
                        ) : (
                          item.endProgramDates
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={item.format}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "format",
                                e.target.value
                              )
                            }
                            className="mainTable-input"
                          />
                        ) : (
                          item.format
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={item.practice}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "format",
                                e.target.value
                              )
                            }
                            className="mainTable-input"
                          />
                        ) : (
                          item.practice
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={item.source}
                            onChange={(e) =>
                              handleInputChange(
                                item.id,
                                "source",
                                e.target.value
                              )
                            }
                            className="mainTable-input"
                          />
                        ) : (
                          item.source
                        )}
                      </td>
                      <td>
                        {editingId === item.id ? (
                          <div className="modal-actions">
                            <button
                              onClick={confirmEdit}
                              className="eventsModalOpenClickButton"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="eventsModalOpenClickButton"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="modal-actions">
                            <button
                              onClick={() => handleEditClick(item.id)}
                              className="eventsModalOpenClickButton"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => handleDelete(item.id)}
                              className="eventsModalOpenClickButton"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {showDeleteModal && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete this record?</p>
                    <div className="modal-actions">
                      <button
                        onClick={confirmDelete}
                        className="eventsModalOpenClickButton"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="eventsModalOpenClickButton"
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {selectedRows.length > 0 && (
              <button onClick={handleSubmit} className="table_buttons">
                Submit
              </button>
            )}
            {showDeleteSuccessModal && <DeleteSuccess />}
            {showDeleteFailModal && <DeleteFail />}
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

export default AllTheData;
