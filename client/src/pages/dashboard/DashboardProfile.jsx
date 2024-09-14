/* eslint-disable react/prop-types */
import { BsCalendarWeek, BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGlobeAsia, FaRegUser } from "react-icons/fa";
import {
  FaCity,
  FaLocationDot,
  FaMapLocationDot,
  FaPhoneFlip,
} from "react-icons/fa6";
import { IoGlobeOutline } from "react-icons/io5";
import { MdLocationCity, MdMiscellaneousServices } from "react-icons/md";
import { TbCategoryFilled, TbClockHour4, TbMapPinCode } from "react-icons/tb";
import { useSelector } from "react-redux";
import { ImHourGlass } from "react-icons/im";
import ProUserUpdate from "../../components/dialog/ProUserUpdate";
import Loader from "../../components/loader/Loader";
import moment from "moment";

const UserDetailCard = ({ icon: Icon, label, value }) => (
  <div className="dashboardUserContactDetails">
    <Icon className="icon" />
    <div>
      <p>{label}</p>
      <p>{value}</p>
    </div>
  </div>
);

const DashboardProfile = () => {
  const { user, isLoading } = useSelector((state) => state.userReducer);

  if (isLoading) {
    return <Loader />;
  }

  return (
    user && (
      <div className="dashboardContainer">
        <div className="dashboardProfileContainer">
          <div className="dashboardProfile">
            <img src={user.image.url} alt="" />
            <div>
              <h4>{user.centerName}</h4>
              <p>{user.email}</p>
            </div>
            <div className="editIcon">
              <ProUserUpdate userData={user} />
            </div>
          </div>
          <div className="dashboardUserContact">
            <UserDetailCard icon={FaRegUser} label="Name" value={user.name} />
            <UserDetailCard
              icon={user.gender === "male" ? BsGenderMale : BsGenderFemale}
              label="Gender"
              value={user.gender}
            />
            <UserDetailCard
              icon={FaPhoneFlip}
              label="Phone Number"
              value={user.phone}
            />
            <UserDetailCard icon={FaCity} label="City" value={user.city} />
            <UserDetailCard
              icon={FaGlobeAsia}
              label="Country"
              value={user.country}
            />
            <UserDetailCard
              icon={MdLocationCity}
              label="State"
              value={user.state}
            />
            <UserDetailCard
              icon={TbMapPinCode}
              label="Pin code"
              value={user.pinCode}
            />
            <UserDetailCard
              icon={FaLocationDot}
              label="Address"
              value={user.address}
            />
          </div>
          <h4>Clinic Info</h4>
          <div className="dashboardUserContact">
            <UserDetailCard
              icon={IoGlobeOutline}
              label="Website"
              value={user.website}
            />
            <UserDetailCard
              icon={FaMapLocationDot}
              label="Google Map Link"
              value={user.googleMapLink.substr(0, 30) + "..."}
            />
            <UserDetailCard
              icon={TbCategoryFilled}
              label="Category"
              value={user.category}
            />
            <UserDetailCard
              icon={ImHourGlass}
              label="Appointment per hour"
              value={user.numberOfAppointments}
            />
            <UserDetailCard
              icon={BsCalendarWeek}
              label="Week day"
              value={`${user.startWeek} - ${user.endWeek}`}
            />
            <UserDetailCard
              icon={TbClockHour4}
              label="Day Hour"
              value={`${moment(user.startTime, "HH:mm").format("hh:mm A")} - 
              ${moment(user.endTime, "HH:mm").format("hh:mm A")}
              `}
            />

            <UserDetailCard
              icon={MdMiscellaneousServices}
              label="All Services"
              value={user.services.map((service) => service.name).join(", ")}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default DashboardProfile;
