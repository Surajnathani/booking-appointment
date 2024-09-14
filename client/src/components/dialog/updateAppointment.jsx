/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";
import "./popupDialog.css";
import moment from "moment";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useUpdateAppointmentMutation } from "../../redux/api/AppointmentApi";
import Loader from "../loader/Loader";

const UpdateBookAppointment = ({ onClose, appointment }) => {
  const [formData, setFormData] = useState({
    service: appointment.service,
    date: new Date(appointment.end).toISOString().split("T")[0],
    time: new Date(appointment.start).toTimeString().slice(0, 5),
  });

  const { user } = useSelector((state) => state.userReducer);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isPastTime = (time) => {
    if (!formData.date) return false;

    const selectedDateTime = moment(
      `${formData.date} ${time}`,
      "YYYY-MM-DD HH:mm"
    );
    return selectedDateTime.isBefore(moment());
  };

  const generateTimeOptions = (start, end) => {
    const options = [];
    let currentTime = moment(start, "HH:mm");

    while (currentTime < moment(end, "HH:mm")) {
      const time24 = currentTime.format("HH:mm");
      const time12 = currentTime.format("h:mm A");
      options.push({ value: time24, label: time12 });
      currentTime.add(1, "hour");
    }
    return options;
  };

  const timeOptions = generateTimeOptions(user.startTime, user.endTime);

  const minDate = new Date().toISOString().split("T")[0];

  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();

  const handleSubmit = async (e, close) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");
    try {
      const response = await updateAppointment({
        formData,
        appointmentId: appointment._id,
      }).unwrap();
      if (response) {
        toast.success("Appointment Booked successfully!", { id: toastId });
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
  };

  if (isLoading) {
    return <Loader />;
  }

  return isLoading ? (
    <Loader />
  ) : (
    <Popup open={true} modal nested onClose={onClose}>
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Update Appointment</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <div className="updateContainer">
            <img
              className="updateImage"
              src={appointment.desc.avatar.url}
              alt=""
            />
            <div>
              <p>
                {appointment.desc.name} (phone: {appointment.desc.phone})
              </p>
              <p>{appointment.desc.email}</p>
            </div>
          </div>
          <form onSubmit={(e) => handleSubmit(e, close)}>
            <div className="inputField">
              <label>Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Service
                </option>
                {user.services.map((service, i) => (
                  <option key={i} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputField">
              <label>Date</label>
              <input
                type="date"
                min={minDate}
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Time</label>
              <select name="time" value={formData.time} onChange={handleChange}>
                <option value="" disabled>
                  Select Time
                </option>
                {timeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={isPastTime(option.value)}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="actions">
              <button className="btn" onClick={close}>
                Cancel
              </button>
              <button
                className="btn"
                type="submit"
                disabled={
                  isLoading ||
                  appointment.desc.status === "Completed" ||
                  appointment.desc.status === "Cancelled"
                }
              >
                {appointment?.desc?.status === "Completed"
                  ? "Completed"
                  : appointment?.desc?.status === "Cancelled"
                  ? "Cancelled"
                  : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default UpdateBookAppointment;
