import { useEffect, useState } from "react";
import { FaRegBell, FaRegClock } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";
import { MdManageHistory, MdOutlineWidgets } from "react-icons/md";

export const featuredCard = [
  {
    id: 1,
    name: "Salon & Beauty",
  },
  {
    id: 2,
    name: "Medical",
  },
  {
    id: 3,
    name: "Financial Advisor",
  },
  {
    id: 4,
    name: "Legal Services",
  },
  {
    id: 5,
    name: "Pet Care ",
  },
  {
    id: 6,
    name: "Automotive",
  },
  {
    id: 7,
    name: "Home Services",
  },
  {
    id: 8,
    name: "Driving Instructor",
  },
  {
    id: 9,
    name: "Fitness & Wellness",
  },
  {
    id: 10,
    name: "Counselor/Therapist",
  },
  {
    id: 11,
    name: "Tattoo/Piercing Studio",
  },
];

export const ratingCategories = [
  { id: "4", label: "4 & above" },
  { id: "3", label: "3 & above" },
  { id: "2", label: "2 & above" },
  { id: "1", label: "1 & above" },
];

const workCard = [
  {
    icon: <IoIosSearch className="largeIcon" />,
    heading: "Search",
    description: "Find the right provider and service for your needs.",
  },
  {
    icon: <IoCalendarOutline className="largeIcon" />,
    heading: "Book Appointment",
    description:
      "Select a time slot, confirm, and schedule your appointment easily.",
  },
  {
    icon: <MdManageHistory className="largeIcon" />,
    heading: "Manage",
    description:
      "View, adjust, and get reminders to keep your schedule organized.",
  },
];

const benefitCard = [
  {
    icon: <FaRegClock className="largeIcon" />,
    heading: "Convenience",
    description:
      "Book appointments anytime, anywhere with our easy-to-use platform.",
  },
  {
    icon: <FaRegBell className="largeIcon" />,
    heading: "Real-Time Updates",
    description:
      "Receive instant notifications about your appointments and any changes.",
  },
  {
    icon: <MdOutlineWidgets className="largeIcon" />,
    heading: "Wide Selection",
    description: "Choose from a variety of providers and services.",
  },
];

const testimonialCard = [
  {
    name: "Alice",
    image:
      "https://cdn.easyfrontend.com/pictures/testimonial/testimonial_15.png",
    description:
      "I've been using this platform to book my appointments, and it has made my life so much easier! Finding the right provider is simple, and scheduling is incredibly quick with just a few clicks. I love how I can manage all my appointments in one place and get timely reminders.",
  },
  {
    name: "John",
    image:
      "https://images.unsplash.com/photo-1678286742832-26543bb49959?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    description:
      "This appointment booking service is a game-changer! It's incredibly easy to find providers, book appointments, and manage everything in one place. The reminders are a lifesaver, ensuring I never miss an appointment. A must-have tool for anyone with a busy schedule!.",
  },
  {
    name: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1672863601285-253fc82db868?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTMwfHx1c2VyfGVufDB8fDB8fHww",
    description:
      "Booking appointments has never been this simple! The platform is intuitive, and I appreciate the range of providers available. The process is fast, and the reminders keep me on track. It’s perfect for anyone who values convenience.",
  },
  {
    name: "Sophia Lee",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "This platform makes booking appointments a breeze! I can search for providers, compare options, and schedule easily. The best part is how efficiently it manages all my appointments with timely reminders. Super user-friendly and reliable!",
  },
  {
    name: "Michael Smith",
    image:
      "https://images.unsplash.com/photo-1672843192615-5913ef88bf17?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjM0fHx1c2VyfGVufDB8fDB8fHww",
    description:
      "I love how straightforward it is to book appointments here. It takes only a few minutes to find a suitable provider and schedule a time. Plus, the platform helps me manage my calendar effectively with timely notifications. Fantastic experience overall!",
  },
  {
    name: "Emily Davis",
    image:
      "https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2lybCUyMG1vZGVsfGVufDB8fDB8fHww",
    description:
      "A great service for booking appointments! The search feature is robust, and booking is so quick. Managing appointments and receiving reminders is very helpful, especially for someone always on the go. Highly recommend it for busy individuals!",
  },
];

export const FeaturedCard = () => {
  return featuredCard.map(({ name, icon }, index) => (
    <div className="card" key={index}>
      {icon}
      <p>{name}</p>
    </div>
  ));
};

export const WorkCard = () => {
  return (
    <div className="cardContainer">
      {workCard.map(({ icon, heading, description }, index) => (
        <div className="infoContainer" key={index}>
          <div className="infoIcon">{icon}</div>
          <div className="infoDetail">
            <p>{heading}</p>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BenefitCard = () => {
  return (
    <div className="cardContainer">
      {benefitCard.map(({ icon, heading, description }, index) => (
        <div className="infoContainer" key={index}>
          <div className="infoIcon">{icon}</div>
          <div className="infoDetail">
            <p>{heading}</p>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TestimonialCard = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === testimonialCard.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="testimonialContainer">
      {testimonialCard.map(({ name, description, image }, index) => (
        <div
          className={`subTestimonialContainer ${
            index === current ? "active" : "inactive"
          }`}
          key={index}
        >
          {index === current && (
            <>
              <p>{description}</p>
              <div className="social">
                <img src={image} alt="" />
                <div className="socialName">
                  <p>{name}</p>
                  <p>@{name.split(" ").join("")}</p>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
      <div className="dots">
        {testimonialCard.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
