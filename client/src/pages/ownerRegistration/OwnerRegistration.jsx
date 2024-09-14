import { useState } from "react";
import "../registration/registration.css";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { featuredCard } from "../../components/card/Card";
import { useDispatch } from "react-redux";
import { useProUserSignupMutation } from "../../redux/api/proUserApi";
import toast from "react-hot-toast";
import { userExists } from "../../redux/reducers/userReducer";

const OwnerRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    centerName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    website: "",
    startWeek: "",
    endWeek: "",
    startTime: "",
    endTime: "",
    googleMapLink: "",
    category: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    image: null,
    numberOfAppointments: 1,
    services: [{ name: "", price: "" }],
  });

  const dispatch = useDispatch();

  const [register, { isLoading }] = useProUserSignupMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      numberOfAppointments: Math.max(prevData.numberOfAppointments - 1, 1),
    }));
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      numberOfAppointments: Math.min(prevData.numberOfAppointments + 1, 10),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const proUser = new FormData();
    for (const key in formData) {
      if (key === "services") {
        formData.services.forEach((service, index) => {
          proUser.append(`services[${index}][name]`, service.name);
          proUser.append(`services[${index}][price]`, service.price);
        });
      } else {
        proUser.append(key, formData[key]);
      }
    }

    const toastId = toast.loading("Registering...");

    try {
      const response = await register(proUser);
      if (response.data) {
        dispatch(userExists(response.data.user));
        toast.success(response.data.message, { id: toastId });
      }
      if (response.error) {
        toast.error(response.error.data.message.split(",")[0], {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An error occurred during registration.", { id: toastId });
    }
  };

  return (
    <section className="mainRegistrationContainer">
      <section className="registerContainer">
        <div>
          <h3>Open a New Clinic</h3>
          <p>Fill out the form below to get started.</p>
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="inputField passwordField">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={showPassword ? "password" : "********"}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="showPassword"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoIosEyeOff className="icon" />
              ) : (
                <IoIosEye className="icon" />
              )}
            </span>
          </div>
          <div className="inputField">
            <label>Phone no.</label>
            <input
              type="number"
              placeholder="987-654-3210"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="inputField">
            <label>Website link</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
          <div className="time">
            <div className="inputField">
              <label>Start week</label>
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
              <label>End week</label>
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
          </div>
          <div className="time">
            <div className="inputField">
              <label>Start hour</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                step="3600"
              />
            </div>
            <div className="inputField">
              <label>End hour</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                step="3600"
              />
            </div>
          </div>
          <div className="inputField">
            <label>Google map link</label>
            <input
              type="text"
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
              {featuredCard.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="inputField">
            <label>Upload image</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />
          </div>
          <div className="inputField">
            <label>Number of appointment per hour</label>
            <div className="serviceInput">
              <button className="btn" onClick={handleDecrease}>
                <FaMinus />
              </button>
              <input
                type="number"
                value={formData.numberOfAppointments}
                readOnly
                style={{ textAlign: "center" }}
              />
              <button className="btn" onClick={handleIncrease}>
                <FaPlus />
              </button>
            </div>
          </div>
          <div className="inputField">
            <label>All Services</label>
            <div className="serviceInputs">
              {formData.services.map((serviceObj, index) => (
                <div key={index} className="serviceInput">
                  <input
                    type="text"
                    name="name"
                    value={serviceObj.name}
                    onChange={(event) => handleServiceChange(index, event)}
                    placeholder="Service Name"
                  />
                  <input
                    type="number"
                    name="price"
                    value={serviceObj.price}
                    onChange={(event) => handleServiceChange(index, event)}
                    placeholder="Charge"
                  />
                  {formData.services.length > 1 &&
                    index < formData.services.length - 1 && (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => removeServiceInput(index)}
                      >
                        <FaMinus />
                      </button>
                    )}
                  {index === formData.services.length - 1 && (
                    <button className="btn" onClick={addServiceInput}>
                      <FaPlus />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="inputField">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
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
            <label>Pin code</label>
            <input
              type="number"
              name="pinCode"
              value={formData.pinCode}
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
          <button
            className="btn"
            type="submit"
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </section>
    </section>
  );
};

export default OwnerRegistration;
