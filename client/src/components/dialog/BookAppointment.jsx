/* eslint-disable react/prop-types */
import moment from "moment";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
import {
  useBookAppointmentMutation,
  useGetCurrentAppointmentQuery,
} from "../../redux/api/AppointmentApi";
import { currentAppointment } from "../../redux/reducers/appointmentReducer";
import "./popupDialog.css";

const BookAppointment = ({ profileData, Icon }) => {
  const [formData, setFormData] = useState({
    service: "",
    date: moment().format("YYYY-MM-DD"),
    time: "",
    email: "",
  });

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

  const timeOptions = generateTimeOptions(
    profileData.startTime,
    profileData.endTime
  );

  const minDate = new Date().toISOString().split("T")[0];

  const proUserId = profileData._id;

  const dispatch = useDispatch();

  const { refetch: refetchCurrentAppointments } =
    useGetCurrentAppointmentQuery();

  const { user: loginUser } = useSelector((state) => state.userReducer);

  const [bookAppointment, { isLoading }] = useBookAppointmentMutation();

  const handleSubmit = async (e, close) => {
    e.preventDefault();

    const toastId = toast.loading("Please wait...");

    try {
      const response = await bookAppointment({
        formData,
        proUserId,
      }).unwrap();
      if (response) {
        const { data } = await refetchCurrentAppointments();
        dispatch(currentAppointment(data.appointments));
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
  const isDateEnabled = (date) => {
    const day = date.getDay();
    return (
      day >= moment().day(profileData?.startWeek).day() &&
      day <= moment().day(profileData?.endWeek).day()
    );
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date: moment(date).format("YYYY-MM-DD") });
  };

  return (
    <Popup
      trigger={
        typeof Icon === "function" ? (
          <Icon className="icon cancelBtn" />
        ) : (
          <button className="btn">{Icon}</button>
        )
      }
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Book Appointment</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <form onSubmit={(e) => handleSubmit(e, close)}>
            <div className="inputField">
              <label>Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option disabled value="">
                  Select Service
                </option>
                {profileData.services.map((service, i) => (
                  <option key={i} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputField">
              <label>Date</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                filterDate={isDateEnabled}
                minDate={minDate}
                name="date"
                dateFormat="dd-MM-yyyy"
                className="datepicker"
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
            {loginUser.role === "ProUser" && (
              <div className="inputField">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                />
              </div>
            )}
            <div className="actions">
              <button className="btn" onClick={close}>
                Cancel
              </button>
              <button className="btn" type="submit" disabled={isLoading}>
                Book
              </button>
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default BookAppointment;
