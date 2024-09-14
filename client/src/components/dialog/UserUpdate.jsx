/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import Popup from "reactjs-popup";
import { useUpdateUserProfileMutation } from "../../redux/api/userApi";
import { userExists } from "../../redux/reducers/userReducer";
import "./popupDialog.css";

const UserUpdate = ({ userData }) => {
  const [avatarPreview, setAvatarPreview] = useState(userData?.avatar?.url);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
    gender: userData.gender || "",
    city: userData.city || "",
    state: userData.state || "",
    pinCode: userData.pinCode || "",
    country: userData.country || "",
    avatar: userData.avatar.url,
  });

  const checkFormChanged = () => {
    const isChanged = Object.keys(formData).some((key) => {
      if (key === "avatar") {
        return formData.avatar !== userData.avatar.url;
      }
      return formData[key] !== userData[key];
    });
    setIsFormChanged(isChanged);
  };

  useEffect(() => {
    checkFormChanged();
  }, [formData]);

  const dispatch = useDispatch();

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        avatar: file,
      }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, close) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const toastId = toast.loading("Updating...");

    try {
      const response = await updateUserProfile(data).unwrap();
      if (response) {
        dispatch(userExists(response.user));
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
    <Popup trigger={<MdOutlineModeEdit />} modal nested>
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Update Profile</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <form onSubmit={(e) => handleSubmit(e, close)}>
            <div className="avatar-upload">
              <div className="avatar-edit">
                <input
                  type="file"
                  id="avatarUpload"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleImageChange}
                />
                <label htmlFor="avatarUpload">
                  <FaCamera className="icon" />
                </label>
              </div>
              <div className="avatar-preview">
                <div
                  id="avatarPreview"
                  style={{
                    backgroundImage: `url(${avatarPreview || "/avatar.jpg"})`,
                  }}
                ></div>
              </div>
            </div>
            <div className="inputField">
              <label>Name</label>
              <input
                type="text"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Email</label>
              <input
                type="email"
                placeholder="m@example.com"
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
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Pin code</label>
              <input
                type="number"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
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

export default UserUpdate;
