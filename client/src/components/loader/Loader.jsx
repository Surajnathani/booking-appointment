import { useEffect, useState } from "react";
import "./loader.css";
import toast from "react-hot-toast";

const Loader = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      toast.success(
        "It is a free server, so it may take 2 minutes to start initially."
      );
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="loaderContainer">
        <div className="loader">
          <span className="loader-text">loading</span>
          <span className="load"></span>
        </div>
      </div>
      {showMessage && (
        <p style={{ textAlign: "center" }}>
          It is a free server, so it may take 2 minutes to start initially.
        </p>
      )}
    </>
  );
};

export default Loader;
