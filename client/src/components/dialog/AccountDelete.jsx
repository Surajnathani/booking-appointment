import { IoClose } from "react-icons/io5";
import Popup from "reactjs-popup";
import "./popupDialog.css";
import { useDeleteProUserMutation } from "../../redux/api/proUserApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userNotExist } from "../../redux/reducers/userReducer";

const AccountDelete = () => {
  const [deleteUser] = useDeleteProUserMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Deleting account...");

    try {
      const response = await deleteUser();
      if (response) {
        toast.success("New member added successfully!", { id: toastId });
        dispatch(userNotExist());
        navigate("/signin");
      } else {
        toast.error(response?.data?.message || "Failed to delete account.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An error occurred during deleting.", { id: toastId });
    }
  };
  return (
    <Popup trigger={<button className="btn">Delete</button>} modal nested>
      {(close) => (
        <div className="modal">
          <div className="header">
            <h4>Are you sure?</h4>
            <button className="close" onClick={close}>
              <IoClose />
            </button>
          </div>
          <p>You want to delete your account</p>
          <div className="actions">
            <button type="button" className="btn" onClick={close}>
              No
            </button>
            <button type="submit" className="btn" onClick={handleDelete}>
              Yes
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default AccountDelete;
