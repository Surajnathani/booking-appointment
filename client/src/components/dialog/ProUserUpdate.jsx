/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import Popup from "reactjs-popup";
import { useUpdateProUserProfileMutation } from "../../redux/api/proUserApi";
import { userExists } from "../../redux/reducers/userReducer";
import "./popupDialog.css";
import { featuredCard } from "../card/Card";
import { FaMinus, FaPlus } from "react-icons/fa";

const ProUserUpdate = ({ userData }) => {
  const [avatarPreview, setAvatarPreview] = useState(userData.image.url);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const [formData, setFormData] = useState({
    centerName: userData.centerName || "",
    name: userData.name || "",
    email: userData.email || "",
    phone: userData.phone || "",
    address: userData.address || "",
    city: userData.city || "",
    state: userData.state || "",
    pinCode: userData.pinCode || "",
    country: userData.country || "",
    website: userData.website || "",
    googleMapLink: userData.googleMapLink || "",
    category: userData.category || "",
    numberOfAppointments: userData.numberOfAppointments || "",
    startWeek: userData.startWeek || "",
    endWeek: userData.endWeek || "",
    startTime: userData.startTime || "",
    endTime: userData.endTime || "",
    services: userData.services || [],
    image: userData.image.url,
  });

  const checkFormChanged = () => {
    const isChanged = Object.keys(formData).some((key) => {
      if (key === "image") {
        return formData.image !== userData.image.url;
      }
      return formData[key] !== userData[key];
    });
    setIsFormChanged(isChanged);
  };

  useEffect(() => {
    checkFormChanged();
  }, [formData]);

  const dispatch = useDispatch();

  const [updateProUserProfile, { isLoading }] =
    useUpdateProUserProfileMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
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

  const handleDecrease = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      numberOfAppointments: Math.max(prevData.numberOfAppointments - 1, 1),
    }));
  };

  const addServiceInput = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { name: "", price: "" }],
    }));
  };

  const removeServiceInput = (index) => {
    setFormData((prevData) => {
      const newServices = prevData.services.filter((_, i) => i !== index);
      return { ...prevData, services: newServices };
    });
  };

  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;

    setFormData((prevData) => {
      const newServices = prevData.services.map((service, i) =>
        i === index ? { ...service, [name]: value } : service
      );
      return { ...prevData, services: newServices };
    });
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      numberOfAppointments: Math.min(prevData.numberOfAppointments + 1, 10),
    }));
  };

  const handleSubmit = async (e, close) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key === "services") {
        formData.services.forEach((service, index) => {
          data.append(`services[${index}][name]`, service.name);
          data.append(`services[${index}][price]`, service.price);
        });
      } else {
        data.append(key, formData[key]);
      }
    }

    const toastId = toast.loading("Updating...");

    try {
      const response = await updateProUserProfile(data).unwrap();
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
              <label>Center Name</label>
              <input
                type="text"
                placeholder="John Doe"
                name="centerName"
                value={formData.centerName}
                onChange={handleChange}
              />
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
            <div className="inputField">
              <label>Website</label>
              <input
                type="text"
                placeholder="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Google Map Link</label>
              <input
                type="text"
                placeholder="Google Map Link"
                name="googleMapLink"
                value={formData.googleMapLink}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label htmlFor="category">Category</label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {featuredCard.map((category, i) => (
                  <option key={i} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputField">
              <label>Number of Appointments</label>
              <div className="serviceInput">
                <button className="btn" onClick={handleDecrease}>
                  <FaMinus />
                </button>
                <input
                  type="number"
                  placeholder="Number of Appointments"
                  name="numberOfAppointments"
                  value={formData.numberOfAppointments}
                  onChange={handleChange}
                  style={{ textAlign: "center" }}
                />
                <button className="btn" onClick={handleIncrease}>
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="inputField">
              <label>Start Week</label>
              <select
                name="startWeek"
                value={formData.startWeek}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Weekday
                </option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="inputField">
              <label>End Week</label>
              <select
                name="endWeek"
                value={formData.endWeek}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Weekday
                </option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="inputField">
              <label>Start Time</label>
              <input
                type="time"
                placeholder="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>End Time</label>
              <input
                type="time"
                placeholder="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
            <div className="inputField">
              <label>Services</label>
              <div className="serviceInputs">
                {formData.services.map((service, index) => (
                  <div key={index}>
                    <div className="serviceInput">
                      <input
                        type="text"
                        name="name"
                        id={`service-${index}`}
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => handleServiceChange(index, e)}
                      />
                      <input
                        type="number"
                        name="price"
                        id={`price-${index}`}
                        placeholder="Price"
                        value={service.price}
                        min={0}
                        onChange={(e) => handleServiceChange(index, e)}
                      />
                      <div className="buttonField">
                        {formData.services.length > 1 && (
                          <button
                            className="btn"
                            onClick={() => removeServiceInput(index)}
                          >
                            <FaMinus />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn" onClick={addServiceInput}>
                  Add Service
                </button>
              </div>
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

export default ProUserUpdate;
