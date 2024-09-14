/* eslint-disable react/prop-types */
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";
import { useUpdateAppointmentMutation } from "../../redux/api/AppointmentApi";
import "./popupDialog.css";

const AppointmentStatus = ({ Icon, appointmentId, status }) => {
  const [updateAppointmentStatus] = useUpdateAppointmentMutation();

  const handleUpdateStatus = async (e, close, status) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");
    try {
      const response = await updateAppointmentStatus({
        formData: { status: status },
        appointmentId,
      });
      if (response) {
        toast.success(`Appointment ${status} successfully!`, { id: toastId });
        close();
      }
      if (response.error) {
        toast.error(response.error.data.message.split(",")[0], { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.data.message.split(",")[0] ||
          "An error occurred during updating.",
        {
          id: toastId,
        }
      );
    }

    close();
  };

  return (
    <Popup
      trigger={
        typeof Icon === "function" ? (
          Icon == IoClose ? (
            <Icon className="icon cancelBtn" />
          ) : (
            <Icon className="icon" />
          )
        ) : (
          <p className={Icon == "Cancel" ? "cancelled" : "completed"}>{Icon}</p>
        )
      }
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Are you sure?</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <p>
            You want to{" "}
            {status === "cancel"
              ? "cancel"
              : status === "accepted"
              ? "accept"
              : status === "rejected"
              ? "reject"
              : "completed"}{" "}
            this appointment
          </p>
          <div className="actions">
            <button type="button" className="btn" onClick={close}>
              No
            </button>
            <button
              type="submit"
              className="btn"
              onClick={(e) => handleUpdateStatus(e, close, status)}
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default AppointmentStatus;
