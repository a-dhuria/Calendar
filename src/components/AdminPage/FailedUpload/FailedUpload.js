import "./FailedUpload.css";

const FailedUpload = () => {
  return (
    <div className="failed">
      <div className="failed-content">
        <h1>Failed!</h1>
        <h2>Please check your network or try again later.</h2>
      </div>
    </div>
  );
};

export default FailedUpload;
