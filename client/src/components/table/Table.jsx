/* eslint-disable react/prop-types */
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useDeleteStaffMemberMutation } from "../../redux/api/staffApi";
import { removeStaffMember } from "../../redux/reducers/staffReducer";
import StaffUpdate from "../dialog/StaffUpdate";
import "./table.css";
import moment from "moment";
import AppointmentStatus from "../dialog/AppointmentStatus";

const AppointmentTable = ({ appointments }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Contact</th>
          <th>Service</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {appointments?.map((appointment) => (
          <tr key={appointment._id}>
            <td data-label="Name" className="tableName">
              <img
                src={appointment.senderId.avatar.url}
                alt=""
                className="smallImage"
              />
              {appointment.senderId.name}
            </td>
            <td data-label="Date">
              {moment(appointment.date).format("DD-MMM-YYYY")}
            </td>
            <td data-label="Time">
              {moment(appointment.time, "HH:mm").format("hh:mm A")}
            </td>
            <td data-label="Contact">{appointment.senderId.phone}</td>
            <td data-label="Service">{appointment.service}</td>
            <td data-label="Action">
              {appointment.status === "Pending" && (
                <p>
                  <AppointmentStatus
                    Icon={IoIosCloseCircleOutline}
                    appointmentId={appointment._id}
                    status={"rejected"}
                  />
                  <AppointmentStatus
                    Icon={IoIosCheckmarkCircleOutline}
                    appointmentId={appointment._id}
                    status={"accepted"}
                  />
                </p>
              )}

              {appointment.status === "Ongoing" && (
                <div className="onGoing">
                  <AppointmentStatus
                    Icon="Cancel"
                    appointmentId={appointment._id}
                    status={"cancel"}
                  />
                  <AppointmentStatus
                    Icon="Complete"
                    appointmentId={appointment._id}
                    status={"completed"}
                  />
                </div>
              )}

              {(appointment.status === "Completed" ||
                appointment.status === "Cancelled" ||
                appointment.status === "Rejected") && (
                <div>
                  <p
                    className={
                      appointment.status === "Completed"
                        ? "complete"
                        : appointment.status === "Ongoing"
                        ? "inProgress"
                        : "rejected"
                    }
                  >
                    {appointment.status}
                  </p>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StaffTable = ({ staffMembers }) => {
  const dispatch = useDispatch();

  const [deleteStaffMember] = useDeleteStaffMemberMutation();

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      const response = await deleteStaffMember(id).unwrap();
      if (response) {
        dispatch(removeStaffMember(id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Person</th>
          <th>Email</th>
          <th>Phone no.</th>
          <th>Start date</th>
          <th>Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {staffMembers.map((staffMember) => (
          <tr key={staffMember._id}>
            <td data-label="Username" className="tableName">
              <img src="/avatar.png" alt="" className="smallImage" />
              {staffMember.username}
            </td>
            <td data-label="Email">{staffMember.email}</td>
            <td data-label="Phone No.">{staffMember.phone}</td>
            <td data-label="Start Date">{staffMember.date}</td>
            <td data-label="Type">
              <span
                className={
                  staffMember.type === "Full Time" ? "fullTime" : "partTime"
                }
              >
                {staffMember.type}
              </span>
            </td>

            <td data-label="Action">
              <div className="staffAction">
                <MdDeleteOutline
                  className="staffIcon"
                  onClick={(e) => handleDelete(e, staffMember._id)}
                />
                <StaffUpdate staffMember={staffMember} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { AppointmentTable, StaffTable };
