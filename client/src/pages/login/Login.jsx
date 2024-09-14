import { useState } from "react";
import toast from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useUserSignInMutation } from "../../redux/api/userApi";
import { userExists } from "../../redux/reducers/userReducer";
import "../registration/registration.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const [userLogin, { isLoading }] = useUserSignInMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Login...");

    try {
      const response = await userLogin(formData);
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
      toast.error("An error occurred during Login.", { id: toastId });
    }
  };

  return (
    <section className="mainRegistrationContainer">
      <section className="registerContainer">
        <div>
          <h3>Login</h3>
          <p>Enter your email and password to access.</p>
        </div>
        <form onSubmit={handleSubmit}>
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
              name="password"
              value={formData.password}
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
          <button
            className="btn"
            type="submit"
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            {isLoading ? "Login..." : "Login"}
          </button>
        </form>
        <p>
          Don’t have an account?
          <Link to="/signup" className="redirectLink">
            {" "}
            Sign up
          </Link>
        </p>
      </section>
    </section>
  );
};

export default Login;
