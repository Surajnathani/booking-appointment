import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
import { useNewStaffMemberMutation } from "../../redux/api/staffApi";
import { addStaffMember } from "../../redux/reducers/staffReducer";
import "./popupDialog.css";
import { FiPlus } from "react-icons/fi";

const AddStaff = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    date: moment().format("YYYY-MM-DD"),
    type: "Full Time",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const { staffMember } = useSelector((state) => state.staffReducer);

  const [addNewStaff, { isLoading }] = useNewStaffMemberMutation();

  const handleSubmit = async (e, close) => {
    e.preventDefault();

    const toastId = toast.loading("Add new Member...");

    try {
      const response = await addNewStaff(formData).unwrap();
      if (response.staffMember) {
        dispatch(addStaffMember([...staffMember, response.staffMember]));
        toast.success("New member added successfully!", { id: toastId });
        close();
      }
      if (response.error) {
        toast.error(response.error.data.message.split(",")[0], { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.data.message.split(",")[0] || "An error occurred during adding.",
        {
          id: toastId,
        }
      );
    }
  };
  return (
    <Popup
      trigger={
        <button className="btn addMemberBtn">
          <p>Add Member</p>
          <FiPlus className="icon" />
        </button>
      }
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Add Member</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <form onSubmit={(e) => handleSubmit(e, close)}>
            <div className="inputField">
              <label>Name</label>
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
              <label>Joining Date</label>
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
                <option disabled>Select Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>
            <div className="actions">
              <button
                className="btn"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
              <button className="btn" type="submit" disabled={isLoading}>
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default AddStaff;
