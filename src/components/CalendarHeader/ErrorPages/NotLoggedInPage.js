import "./NotLoggedInPage.css";

const NotLoggedInPage = () => {
  return (
    <div className="notAdminPage">
      <div className="notAdminPage-text">
        <h2>Access Denied</h2>
        <br />
        <p className="">You need to login to view this page</p>
      </div>
    </div>
  );
};

export default NotLoggedInPage;
