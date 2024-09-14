import moment from "moment";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteReviewMutation,
  useGetReviewsQuery,
} from "../../redux/api/reviewApi";
import { setMyReviews } from "../../redux/reducers/reviewReducer";
import Loader from "../../components/loader/Loader";

const DashboardReviews = () => {
  const { user } = useSelector((state) => state.userReducer);

  const dispatch = useDispatch();

  const { data, isLoading } = useGetReviewsQuery(user._id);

  const [deleteReview] = useDeleteReviewMutation();

  useEffect(() => {
    if (data) {
      dispatch(setMyReviews(data.stats));
    }
  }, [data, user, dispatch]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await deleteReview(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="appointmentsReview">
      <h4>Review ({data?.stats?.reviews?.length})</h4>
      {data.stats.reviews.length === 0 ? (
        <div className="noData" style={{ height: "80vh" }}>
          <p style={{ fontSize: "30px" }}>No review found</p>
        </div>
      ) : (
        <div className="dashboardReviews">
          <div className="dashboardReview">
            {!isLoading &&
              data.stats.reviews.map((review) => (
                <div key={review._id} className="reviews">
                  <div className="dashboardAllReview">
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
                  <div>
                    <MdDeleteOutline
                      className="deleteIcon"
                      onClick={(e) => handleDelete(e, review._id)}
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="dashboardReviewStats">
            <h4>Rating</h4>
            <div className="reviewAndRating">
              <div className="totalReview">
                <p>
                  {data.stats.totalRatings.substr(0, 3)}{" "}
                  <FaStar className="icon" />
                </p>
                <p>{data.stats.totalReviews} Ratings</p>
              </div>
              <span></span>
              <div>
                {data.stats.totalStarsGroup.map((rating) => {
                  const percentage = (
                    (rating.count / data.stats.totalReviews) *
                    100
                  ).toFixed(2);
                  return (
                    <div
                      className={`review review-${rating.stars}`}
                      key={rating.star}
                    >
                      <p>
                        {rating.star} <FaStar className="icon" />
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
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardReviews;
