/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import Popup from "reactjs-popup";
import "./popupDialog.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateStaffMemberMutation } from "../../redux/api/staffApi";
import toast from "react-hot-toast";
import { updateStaffMember } from "../../redux/reducers/staffReducer";

const StaffUpdate = ({ staffMember }) => {
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [formData, setFormData] = useState({
    username: staffMember.username || "",
    email: staffMember.email || "",
    phone: staffMember.phone || "",
    date: staffMember.date || "",
    type: staffMember.type || "",
  });

  const checkFormChanged = () => {
    const isChanged = Object.keys(formData).some((key) => {
      if (key === "avatar") {
        return formData.avatar !== staffMember.avatar.url;
      }
      return formData[key] !== staffMember[key];
    });
    setIsFormChanged(isChanged);
  };

  useEffect(() => {
    checkFormChanged();
  }, [formData]);

  const dispatch = useDispatch();

  const [updateStaff, { isLoading }] = useUpdateStaffMemberMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, close) => {
    e.preventDefault();

    const toastId = toast.loading("Updating...");
    try {
      const response = await updateStaff({
        id: staffMember._id,
        ...formData,
      }).unwrap();
      if (response) {
        dispatch(updateStaffMember(response.updateStaffMember));
        toast.success(response.message, { id: toastId });
      }
      close();
      setIsFormChanged(false);
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

  return (
    <Popup trigger={<MdModeEdit className="staffIcon" />} modal nested>
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Update Member</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <form onSubmit={(e) => handleSubmit(e, close)}>
            <div className="inputField">
              <label>Username</label>
              <input
                type="text"
                placeholder="John Doe"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Phone no.</label>
              <input
                type="number"
                placeholder="+1 (555) 123-4567"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>
            <div className="actions">
              <button
                type="button"
                className="btn"
                onClick={close}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                disabled={isLoading || !isFormChanged}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default StaffUpdate;
