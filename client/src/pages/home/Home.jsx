import BackgroundAnimation from "../../components/backgroundAnimation/BackgroundAnimation";
import {
  BenefitCard,
  FeaturedCard,
  TestimonialCard,
  WorkCard,
} from "../../components/card/Card";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <header className="mainHomeContainer">
      <section className="homeContainer">
        <h1>
          Easily Book <span style={{ color: "#3592ff" }}>Appointments</span>{" "}
          <br /> Anytime, Anywhere!
        </h1>
        <p>
          Find the perfect appointment for your needs with our easy-to-use
          platform.
        </p>
        <div className="homeSearch">
          <input
            className="search"
            type="text"
            placeholder="search for services or provider"
            autoComplete="off"
          />
          <button className="btn" onClick={() => navigate("/appointment")}>
            Make Appointment
          </button>
        </div>
        <BackgroundAnimation />
      </section>
      <section className="bgContainer">
        <div className="subHomeContainer">
          <div className="subHome">
            <h2>How It Works</h2>
            <p>
              Our simple 3-step process makes booking appointments a breeze.
            </p>
          </div>
          <WorkCard />
        </div>
      </section>
      <section className="subHomeContainer">
        <div className="featured">
          <h2>Featured</h2>
          <p>
            Check out some of the top services and providers on our platform.
          </p>
        </div>
        <div className="categories">
          <FeaturedCard />
        </div>
      </section>
      <section className="bgContainer">
        <div className="subHomeContainer">
          <div className="subHome">
            <h2>Benefits</h2>
            <p>Discover the advantages of booking appointments with us.</p>
          </div>
          <BenefitCard />
        </div>
      </section>
      <section className="subHomeContainer">
        <div className="testimonials">
          <h2>Testimonials</h2>
          <p>
            Hear from our satisfied customers about their experience with our
            platform.
          </p>
        </div>
        <TestimonialCard />
      </section>
    </header>
  );
};

export default Home;
