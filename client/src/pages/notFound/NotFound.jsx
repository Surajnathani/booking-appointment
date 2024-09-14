import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  return (
    <div className="errorContainer">
      <div className="errorHeader">
        <h1>
          <span>Sorry!,</span> this page isn′t available
        </h1>
        <p>The page viewer looking for couldn′t be found</p>
        <p>
          Go back to{" "}
          <span>
            <Link to="/">home page</Link>
          </span>{" "}
          or visit our{" "}
          <span>
            <Link to="/contact">help center</Link>
          </span>
        </p>
      </div>
      <div className="errorImage">
        <img src="/notFound.jpg" alt="notfound" className="notFoundImg" />
      </div>
    </div>
  );
};

export default NotFound;
