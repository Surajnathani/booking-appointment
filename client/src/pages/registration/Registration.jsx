import { useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useUserSignupMutation } from "../../redux/api/userApi";
import "./registration.css";
import { userExists } from "../../redux/reducers/userReducer";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    gender: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    avatar: null,
  });

  const dispatch = useDispatch();

  const [register, { isLoading }] = useUserSignupMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = new FormData();
    for (const key in formData) {
      user.append(key, formData[key]);
    }

    const toastId = toast.loading("Registering...");

    try {
      const response = await register(user);
      if (response.data) {
        dispatch(userExists(response.data.user));
        toast.success(response.data.message, { id: toastId });
      }
      if (response.error) {
        toast.error(response.error.data.message.split(",")[0], { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred during registration.", { id: toastId });
    }
  };

  return (
    <section className="mainRegistrationContainer">
      <section className="registerContainer">
        <div>
          <h3>Register</h3>
          <p>Create a new account to get started.</p>
        </div>
        <form onSubmit={handleSubmit}>
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
                  backgroundImage: `url(${avatarPreview || "/avatar.png"})`,
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
              autoComplete="off"
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
              autoComplete="off"
            />
          </div>
          <div className="inputField passwordField">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder={showPassword ? "password" : "********"}
              value={formData.password}
              name="password"
              onChange={handleChange}
              autoComplete="off"
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
              placeholder="+1 (555) 123-4567"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="off"
            />
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
              autoComplete="off"
            />
          </div>
          <div className="inputField">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              autoComplete="off"
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
        <p>
          Don’t have an account?
          <Link to="/signin" className="redirectLink">
            {" "}
            Sign in
          </Link>
        </p>
      </section>
    </section>
  );
};

export default Registration;
