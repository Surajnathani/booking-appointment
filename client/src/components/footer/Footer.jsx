import { FaInstagram } from "react-icons/fa6";
import "./footer.css";
import { FiFacebook, FiTwitter } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footerContainer">
        <section>
          <h4>About Us</h4>
          <Link to="/">Our Story</Link>
          <Link to="/">Team</Link>
          <Link to="/">Careers</Link>
        </section>
        <section>
          <h4>Contact Us</h4>
          <Link to="/contact">Email</Link>
          <Link to="/contact">Phone</Link>
          <Link to="/contact">Address</Link>
        </section>
        <section>
          <h4>Legal</h4>
          <Link to="/">Terms & Conditions</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">FAQ</Link>
        </section>
        <section>
          <h4>Follow Us</h4>
          <span>
            <Link to="/">
              <FiFacebook className="icon" />
            </Link>
            <Link to="/">
              <FaInstagram className="icon" />
            </Link>
            <Link to="/">
              <FiTwitter className="icon" />
            </Link>
          </span>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
