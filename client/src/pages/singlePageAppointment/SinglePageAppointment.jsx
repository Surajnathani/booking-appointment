import moment from "moment";
import { useEffect } from "react";
import { FaGlobeAsia, FaStar } from "react-icons/fa";
import {
  FaCity,
  FaClock,
  FaGlobe,
  FaLocationDot,
  FaPhoneFlip,
} from "react-icons/fa6";
import { MdEmail, MdLocationCity } from "react-icons/md";
import { TbMapPinCode } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AddReview from "../../components/dialog/AddReview";
import BookAppointment from "../../components/dialog/BookAppointment";
import Loader from "../../components/loader/Loader";
import { useFetchSingleProUserProfileQuery } from "../../redux/api/proUserApi";
import { useGetReviewsQuery } from "../../redux/api/reviewApi";
import "./singlePageAppointment.css";

const SinglePageAppointment = () => {
  const { userId } = useParams();
  const { data, isLoading, refetch } =
    useFetchSingleProUserProfileQuery(userId);

  const { user } = useSelector((state) => state.userReducer);

  const { data: reviewData, isLoading: reviewLoading } =
    useGetReviewsQuery(userId);

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  if (isLoading || reviewLoading || !user) {
    return <Loader />;
  }

  return (
    <div className="mainAppointmentSingleContainer">
      <section className="appointmentSingleContainer">
        <div className="appointmentImage">
          <img src={data.user.image.url} alt="" />
        </div>
        <div className="appointmentHeader">
          <div className="appointmentHeaderContainer">
            <div className="appointmentRatingContainer">
              <h3>{data.user.centerName}</h3>
              {reviewData.stats.totalRatings !== "0.00" ? (
                <div className="appointmentRatingAndReview">
                  <div className="appointmentRating">
                    <FaStar className="ratingIcon" />
                    <p>{reviewData.stats.totalRatings}</p>
                  </div>
                  <p className="appointmentTotalReview">
                    ({reviewData.stats.totalReviews} reviews)
                  </p>
                </div>
              ) : (
                <p style={{ fontWeight: "500" }}>
                  <FaStar className="ratingIcon" /> No reviews yet
                </p>
              )}
            </div>
            <div>
              {user.role != "ProUser" && (
                <BookAppointment
                  profileData={data.user}
                  Icon={"Book Appointment"}
                />
              )}
            </div>
          </div>
          <div className="appointmentDetail">
            <div className="appointmentDetailCard">
              <FaClock className="icon" />
              <div>
                <p>Hours</p>
                <p>
                  {data.user.startWeek.substr(0, 3)}-
                  {data.user.endWeek.substr(0, 3)}:{" "}
                  {moment(data.user.startTime, "HH:mm").format("hh:mm A")} -{" "}
                  {moment(data.user.endTime, "HH:mm").format("hh:mm A")}
                </p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <FaPhoneFlip className="icon" />
              <div>
                <p>Phone</p>
                <p>
                  <Link to={`tel:${data.user.phone}`}>{data.user.phone}</Link>
                </p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <MdEmail className="icon" />
              <div>
                <p>Email</p>
                <p>
                  <Link to={`mailto:${data.user.email}`}>
                    {data.user.email}
                  </Link>
                </p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <FaGlobe className="icon" />
              <div>
                <p>Website</p>
                <p>
                  <Link to={data.user.website} target="_blank">
                    {data.user.website}
                  </Link>
                </p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <FaCity className="icon" />
              <div>
                <p>City</p>
                <p>{user.city}</p>
              </div>
            </div>

            <div className="appointmentDetailCard">
              <MdLocationCity className="icon" />
              <div>
                <p>State</p>
                <p>{user.state}</p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <TbMapPinCode className="icon" />
              <div>
                <p>Pin code</p>
                <p>{user.pinCode}</p>
              </div>
            </div>

            <div className="appointmentDetailCard">
              <FaLocationDot className="icon" />
              <div>
                <p>Address</p>
                <p>{data.user.address}</p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <FaGlobeAsia className="icon" />
              <div>
                <p>Country</p>
                <p>{user.country}</p>
              </div>
            </div>
            <div className="appointmentDetailCard">
              <FaGlobeAsia className="icon" />
              <div>
                <p>Google map</p>
                <p>
                  <Link to={user.googleMapLink} target="_blank">
                    {user.googleMapLink}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="appointmentServicesContainer">
        <div className="allServicesContainer">
          <h4>Services Offered</h4>
          <div className="allServices">
            <div className="allServicesHeading">
              <p>Services</p>
              <p>Charge</p>
            </div>
            {data.user.services.map((service, index) => (
              <div key={index} className="allService">
                <p>{service.name}</p>
                <p>₹{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="reviewContainer">
        <div className="allReviewContainer">
          <div className="postReview">
            <h4>Customer Reviews</h4>
            {user.role != "ProUser" && <AddReview userId={userId} />}
          </div>
          {reviewData.stats.reviews.length === 0 ? (
            <div className="noData">
              <p style={{ fontSize: "16px" }}>No review found</p>
            </div>
          ) : (
            <div className="allReviews">
              {reviewData.stats.reviews.map((review) => (
                <div className="allReview" key={review._id}>
                  <div className="reviewProfile">
                    <img src={review.senderId.avatar.url} alt="" />
                    <div>
                      <p>{review.senderId.name}</p>
                      <p>{moment(review.createdAt).fromNow()}</p>
                    </div>
                  </div>
                  <div className="reviewStarDetails">
                    <div className={`userRating star-${review.rating}`}>
                      <p>{review.rating}</p>
                      <FaStar className="icon" />
                    </div>
                    <p>{moment(review.createdAt).format("MMM YYYY")}</p>
                  </div>
                  <div className="reviewDetails">
                    <p>{review.review}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="allReviewContainer">
          {reviewData.stats.reviews.length === 0 ? null : (
            <>
              <h4>Rating</h4>
              <div className="reviewAndRating">
                <div className="totalReview">
                  <p>
                    {reviewData.stats.totalRatings.substr(0, 3)}{" "}
                    <FaStar className="icon" />
                  </p>
                  <p>{reviewData.stats.totalReviews} Ratings</p>
                </div>
                <span></span>
                <div>
                  {reviewData.stats.totalStarsGroup.map((rating) => {
                    const percentage = (
                      (rating.count / reviewData.stats.totalReviews) *
                      100
                    ).toFixed(2);
                    return (
                      <div
                        className={`review review-${rating.stars}`}
                        key={rating.star}
                      >
                        <p>
                          {rating.star}
                          <FaStar className="icon" />
                        </p>
                        <div className="progressBar">
                          <div
                            className={`progressBarFill star-${rating.star}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <p>{rating.count}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default SinglePageAppointment;
