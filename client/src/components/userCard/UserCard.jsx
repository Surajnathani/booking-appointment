import { MdOutlineStarPurple500 } from "react-icons/md";
import { Link } from "react-router-dom";
import "./userCard.css";

const UserCard = ({ data }) => {
  return data.map((data) => (
    <div className="cardsContainer" key={data._id}>
      <img src={data.image.url} alt="image" />
      <div className="usernameDetails">
        <p>{data.centerName.substr(0, 20)}</p>
        {data.avgRating != 0 && (
          <div className="ratingIcons">
            <MdOutlineStarPurple500 />
            {data.avgRating.toFixed(1)}
          </div>
        )}
      </div>
      <p>{data.category}</p>
      <Link to={`/appointment/${data._id}`}>
        <button className="outlineBtn" style={{ width: "100%" }}>
          Book Appointment
        </button>
      </Link>
    </div>
  ));
};

export default UserCard;
