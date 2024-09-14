import { useState } from "react";
import toast from "react-hot-toast";
import { GoMail } from "react-icons/go";
import { SlClock, SlLocationPin, SlPhone } from "react-icons/sl";
import { useSelector } from "react-redux";
import "./contact.css";
import { useSendMessageMutation } from "../../redux/api/contactApi";

const Contact = () => {
  const { user } = useSelector((state) => state.userReducer);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Sending...");

    try {
      const response = await sendMessage(formData).unwrap();
      if (response) {
        toast.success("Message sent successfully!", { id: toastId });
      }
    } catch (error) {
      toast.error(error.data.message.split(",")[0], { id: toastId });
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      subject: "",
      message: "",
    });
  };

  return (
    <header className="contactContainer">
      <section className="contactContainer">
        <h1>Contact Us</h1>
        <p>
          We’re here to help. Get in touch with us for any inquiries or support.
        </p>
      </section>
      <section className="subContactContainer">
        <div className="contact">
          <h3>Contact Information</h3>
          <div className="addressDetails">
            <div className="addressDetail">
              <SlLocationPin className="icon" />
              <p>123 Main Street, Any town USA</p>
            </div>
            <div className="addressDetail">
              <SlPhone className="icon" />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="addressDetail">
              <GoMail className="icon" />
              <p>support@acme.com</p>
            </div>
            <div className="addressDetail">
              <SlClock className="icon" />
              <p>Mon-Fri: 9am - 5pm</p>
            </div>
          </div>
        </div>
        <div className="contact">
          <h3>Get in Touch</h3>
          <form onSubmit={handleSubmit}>
            <span>
              <div className="inputField">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
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
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            </span>
            <div className="inputField">
              <label>Subject</label>
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="inputField">
              <label>Message</label>
              <textarea
                placeholder="Your Message"
                rows={10}
                name="message"
                value={formData.message}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </section>
    </header>
  );
};

export default Contact;
