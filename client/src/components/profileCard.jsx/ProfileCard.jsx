import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { FaGlobeAsia } from "react-icons/fa";
import { FaCity, FaLocationDot, FaPhoneFlip } from "react-icons/fa6";
import { MdLocationCity } from "react-icons/md";
import { TbMapPinCode } from "react-icons/tb";
import { useSelector } from "react-redux";
import UserUpdate from "../dialog/UserUpdate";
import "./profileCard.css";
import Loader from "../loader/Loader";

const ProfileCard = () => {
  const { user, isLoading } = useSelector((state) => state.userReducer);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="profileContainer">
      <div className="profile">
        <img src={user.avatar.url} alt="" />
        <div>
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
        <div className="editIcon">
          <UserUpdate userData={user} />
        </div>
      </div>
      <div className="userContact">
        <div className="userContactDetails">
          {user.gender === "male" ? (
            <BsGenderMale className="icon" />
          ) : (
            <BsGenderFemale className="icon" />
          )}
          <div>
            <p>Gender</p>
            <p>{user.gender}</p>
          </div>
        </div>
        <div className="userContactDetails">
          <FaPhoneFlip className="icon" />
          <div>
            <p>Phone Number</p>
            <p>{user.phone}</p>
          </div>
        </div>
        <div className="userContactDetails">
          <FaCity className="icon" />
          <div>
            <p>City</p>
            <p>{user.city}</p>
          </div>
        </div>
        <div className="userContactDetails">
          <FaGlobeAsia className="icon" />
          <div>
            <p>Country</p>
            <p>{user.country}</p>
          </div>
        </div>
        <div className="userContactDetails">
          <MdLocationCity className="icon" />
          <div>
            <p>State</p>
            <p>{user.state}</p>
          </div>
        </div>
        <div className="userContactDetails">
          <FaLocationDot className="icon" />
          <div>
            <p>Address</p>
            <p>{user.address}</p>
          </div>
        </div>
        <div className="userContactDetails">
          <TbMapPinCode className="icon" />
          <div>
            <p>Pin code</p>
            <p>{user.pinCode}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
