import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useProUserLogoutMutation } from "../../redux/api/proUserApi";
import { useUserLogoutMutation } from "../../redux/api/userApi";
import { userNotExist } from "../../redux/reducers/userReducer";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuActive, setMenuActive] = useState(false);

  const { user } = useSelector((state) => state.userReducer);

  const login = user;
  const role = user?.role;

  const dispatch = useDispatch();

  const [logoutUser] = useUserLogoutMutation();
  const [logoutProUser] = useProUserLogoutMutation();

  const handleLogout = async () => {
    try {
      if (role === "ProUser") {
        await logoutProUser().unwrap();
      } else {
        await logoutUser().unwrap();
      }
      dispatch(userNotExist());
      toast.success("Successfully logged out");
      navigate("/signin");
      setMenuActive(false);
    } catch (err) {
      toast.error("Failed to log out");
    }
  };

  const toggleMenu = () => {
    setMenuActive(!isMenuActive);
  };

  return (
    <nav className="mainNavContainer">
      <div className="navContainer">
        <Link to="/" className="brand">
          <div className="logo">
            <img src="/logo.png" />
            <span>Book appointment</span>
          </div>
        </Link>
        <div className={`navLink ${isMenuActive ? "active" : "inactive"}`}>
          <NavLink to="/" className="link" onClick={() => setMenuActive(false)}>
            Home
          </NavLink>
          <NavLink
            to="/appointment"
            className="link"
            onClick={() => setMenuActive(false)}
          >
            Appointment
          </NavLink>
          <NavLink
            to="/contact"
            className="link"
            onClick={() => setMenuActive(false)}
          >
            Contact us
          </NavLink>

          {login ? (
            <>
              {role === "User" ? (
                <NavLink
                  to="/profile"
                  className="link"
                  onClick={() => setMenuActive(false)}
                >
                  Profile
                </NavLink>
              ) : (
                <NavLink
                  to="/dashboard/home"
                  className="link"
                  onClick={() => setMenuActive(false)}
                >
                  dashboard
                </NavLink>
              )}
              <NavLink to="/signin" className="link" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className="link"
                onClick={() => setMenuActive(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="link"
                onClick={() => setMenuActive(false)}
              >
                Registration
              </NavLink>
              <button
                className="outlineBtn"
                onClick={() => {
                  navigate("/joinus");
                  setMenuActive(false);
                }}
              >
                Join us
              </button>
            </>
          )}
        </div>
        <div className="burger" onClick={toggleMenu}>
          {isMenuActive ? (
            <IoClose className="icon" />
          ) : (
            <RxHamburgerMenu className="icon" />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
