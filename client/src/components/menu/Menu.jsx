import { FaRegCalendarAlt, FaRegUser } from "react-icons/fa";
import { IoCalendarOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineReviews } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import "./menu.css";

const Menu = () => {
  return (
    <div className="links">
      <NavLink to="/dashboard/home" className="link">
        <LuLayoutDashboard className="icon" />
        <p className="hide">Dashboard</p>
      </NavLink>
      <NavLink to="/dashboard/Appointments" className="link">
        <FaRegCalendarAlt className="icon" />
        <p className="hide">Appointments</p>
      </NavLink>
      <NavLink to="/dashboard/Reviews" className="link">
        <MdOutlineReviews className="icon" />
        <p className="hide">Reviews</p>
      </NavLink>
      <NavLink to="/dashboard/Staff" className="link">
        <AiOutlineTeam className="icon" />
        <p className="hide">Staff</p>
      </NavLink>
      <NavLink to="/dashboard/Profile" className="link">
        <FaRegUser className="icon" />
        <p className="hide">Profile</p>
      </NavLink>
      <NavLink to="/dashboard/calender" className="link">
        <IoCalendarOutline className="icon" />
        <p className="hide">Calender</p>
      </NavLink>
      <NavLink to="/dashboard/setting" className="link">
        <IoSettingsOutline className="icon" />
        <p className="hide">Setting</p>
      </NavLink>
    </div>
  );
};

export default Menu;
