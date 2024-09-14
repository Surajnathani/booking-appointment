import moment from "moment";
import { useEffect } from "react";
import { FaRupeeSign, FaStar } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BarChart, LineChart } from "../../components/charts/Charts";
import Loader from "../../components/loader/Loader";
import { AppointmentTable } from "../../components/table/Table";
import { useGetCurrentAppointmentQuery } from "../../redux/api/AppointmentApi";
import { useGetDashboardDataQuery } from "../../redux/api/dashboardApi";
import { useGetReviewsQuery } from "../../redux/api/reviewApi";
import { setMyReviews } from "../../redux/reducers/reviewReducer";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const {
    data: reviewData,
    isLoading: reviewLoading,
    refetch: refetchReviews,
  } = useGetReviewsQuery(user?._id);

  const {
    data: dashboardStats,
    isLoading: dashboardLoading,
    refetch: refetchDashboardData,
  } = useGetDashboardDataQuery();

  const {
    data: currentAppointments,
    isLoading: currentAppointmentsLoading,
    refetch: refetchAppointments,
  } = useGetCurrentAppointmentQuery();

  useEffect(() => {
    refetchReviews();
    refetchDashboardData();
    refetchAppointments();
  }, [refetchReviews, refetchDashboardData, refetchAppointments]);

  useEffect(() => {
    if (reviewData) {
      dispatch(setMyReviews(reviewData.stats));
    }
  }, [reviewData, user, dispatch]);

  if (dashboardLoading || currentAppointmentsLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboardContainer">
      <div className="totalDetails">
        <div className="totalDetail">
          <div>
            <RiCalendarScheduleFill className="icon" />
          </div>
          <div>
            <p>Total Appointments</p>
            <h4>{dashboardStats.stats.appointmentCount}</h4>
          </div>
        </div>
        <div className="totalDetail">
          <div>
            <FaRupeeSign className="icon" />
          </div>
          <div>
            <p>Today earning</p>
            <h4>₹{dashboardStats.stats.todayEarning}</h4>
          </div>
        </div>
        <div className="totalDetail">
          <div>
            <IoPeople className="icon" />
          </div>
          <div>
            <p>Total Staff Members</p>
            <h4>{dashboardStats.stats.staffCount}</h4>
          </div>
        </div>
        <div className="totalDetail">
          <div>
            <FaRupeeSign className="icon" />
          </div>
          <div>
            <p>Total earning</p>
            <h4>₹{dashboardStats.stats.totalEarning}</h4>
          </div>
        </div>
      </div>
      <div className="charts">
        <div className="chartContainer earningChart">
          <LineChart dataList={dashboardStats.stats.monthlyEarning} />
        </div>
        <div className="chartContainer barChart">
          <BarChart dataList={dashboardStats.stats.weeklyEarning} />
        </div>
      </div>
      <div className="allAppointmentsContainer">
        <div className="appointmentsTable">
          <div className="appointmentHead">
            <h4>Appointments</h4>
            <button onClick={() => navigate("/dashboard/Appointments")}>
              View all
            </button>
          </div>
          {currentAppointments.appointments.length === 0 ? (
            <div className="noData">
              <p>No new appointment</p>
            </div>
          ) : (
            <AppointmentTable
              appointments={currentAppointments.appointments.slice(0, 4)}
            />
          )}
        </div>
        <div className="appointmentsReview">
          <div className="appointmentHead">
            <h4>Review</h4>
            <button onClick={() => navigate("/dashboard/Reviews")}>
              View all
            </button>
          </div>
          {currentAppointments.appointments.length === "0" ? (
            <div className="noData">
              <p>No review found</p>
            </div>
          ) : (
            <div className="allReviews">
              {!reviewLoading &&
                reviewData.stats.reviews
                  .map((review) => {
                    return (
                      <div className="allReview" key={review._id}>
                        <div className={`userRating star-${review.rating}`}>
                          <p>{review.rating}</p>
                          <FaStar className="icon" />
                        </div>
                        <div className="reviewDetails">
                          <p>{review.review}</p>
                          <p>
                            {review.senderId.name} |{" "}
                            {moment(review.createdAt).format("D MMM YYYY")}
                          </p>
                        </div>
                      </div>
                    );
                  })
                  .slice(0, 3)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
