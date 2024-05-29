import React, { useContext } from "react";
import AllTheData from "./AllTheData/AllTheData";
import GlobalContext from "../../../Context/GlobalContext";

const EditAndDelete = () => {
  const { siteData } = useContext(GlobalContext);

  return (
    <div>
      <AllTheData data={siteData} />
    </div>
  );
};

export default EditAndDelete;
