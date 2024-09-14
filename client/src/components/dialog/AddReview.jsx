/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import Popup from "reactjs-popup";
import { useCreateReviewMutation } from "../../redux/api/reviewApi";
import "./popupDialog.css";

const AddReview = ({ userId }) => {
  const [formData, setFormData] = useState({
    review: "",
    rating: 1,
  });

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [addReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e, close) => {
    e.preventDefault();

    const toastId = toast.loading("Posting review...");

    try {
      const response = await addReview({ review: formData, proUserId: userId });
      if (response.data) {
        toast.success("Review added successfully!", { id: toastId });
        close();
      }
      if (response.error) {
        toast.error(response.error.data.message.split(",")[0], {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(
        error.data.message.split(",")[0] ||
          "An error occurred during updating.",
        {
          id: toastId,
        }
      );
    }
  };

  const handleStarClick = (rating) => {
    setFormData((prevFormData) => ({ ...prevFormData, rating }));
  };

  return (
    <Popup
      trigger={<button className="reviewPostButton">Post review</button>}
      modal
      nested
    >
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Post review</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <form onSubmit={(e) => handleSubmit(e, close)}>
            <div className="inputField">
              <label>Stars</label>
              <div className="reviewStar">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={24}
                    color={star <= formData.rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleStarClick(star)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>
            </div>
            <div className="inputField">
              <label>Comment here</label>
              <div className="reviewInput">
                <input
                  type="text"
                  placeholder="write your review here..."
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                />
                <RiSendPlaneFill className="icon" />
              </div>
            </div>

            <div className="actions">
              <button
                className="btn"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
              <button className="btn" type="submit" disabled={isLoading}>
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </Popup>
  );
};

export default AddReview;
