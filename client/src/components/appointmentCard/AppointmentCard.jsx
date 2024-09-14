/* eslint-disable react/prop-types */
import moment from "moment";
import { MdLocationSearching } from "react-icons/md";
import AppointmentStatus from "../dialog/AppointmentStatus";
import "./appointmentCard.css";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const AppointmentCard = ({ appointments }) => {
  return (
    <div className="allAppointmentContainer">
      {appointments.map((appointment) => (
        <div key={appointment._id} className="allData">
          <div className="subData">
            <div>
              <Link to={`/appointment/${appointment.receiverId._id}`}>
                <h5>{appointment.service}</h5>
              </Link>
              <p>
                {moment(appointment.date).format("DD-MMM-YYYY")} -{" "}
                {moment(appointment.time, "HH:mm").format("hh:mm A")}
              </p>
              {appointment.status === "Pending" && (
                <AppointmentStatus
                  Icon={IoClose}
                  appointmentId={appointment._id}
                  status={"cancel"}
                />
              )}
            </div>
            <div>
              <p
                className={
                  appointment.status === "Completed"
                    ? "complete"
                    : appointment.status === "Ongoing"
                    ? "inProgress"
                    : appointment.status === "Pending"
                    ? "pending"
                    : "rejected"
                }
              >
                {appointment.status}
              </p>
            </div>
          </div>
          <div className="subLocationData">
            <div className="dataIcon">
              <MdLocationSearching className="locationIcon" />
            </div>
            <div>
              <p>{appointment.receiverId.centerName}</p>
              <p>{appointment.receiverId.address}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentCard;
