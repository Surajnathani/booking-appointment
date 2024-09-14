import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import Filter from "../../components/filter/Filter";
import Loader from "../../components/loader/Loader";
import UserCard from "../../components/userCard/UserCard";
import {
  useFetchProUserProfilesQuery,
  useSearchProUserMutation,
} from "../../redux/api/proUserApi";
import { appointmentProfile } from "../../redux/reducers/appointmentProfileReducer";
import "./appointment.css";

const Appointment = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { data, isLoading } = useFetchProUserProfilesQuery({
    category: selectedCategory,
    rating: selectedRating,
  });

  const dispatch = useDispatch();

  const [searchProfile, { isLoading: searchLoading }] =
    useSearchProUserMutation();

  useEffect(() => {
    if (data) {
      dispatch(appointmentProfile(data.profiles));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProfile({ query: searchQuery })
          .then(({ data }) => setSearchResults(data.proMember || []))
          .catch((error) => console.error(error));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchProfile, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header className="mainAppointmentContainer">
      <section className="appointmentContainer">
        <div className="leftAppointmentContainer">
          <Filter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />
        </div>
        <div className="rightAppointmentContainer">
          <div className="searchContainer">
            <input
              className="searchAppointment"
              type="text"
              placeholder="search by name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="searchBtn">
              {searchQuery ? (
                <IoClose className="icon" onClick={handleResetSearch} />
              ) : (
                <IoMdSearch className="icon" />
              )}
            </button>
          </div>
          {isLoading || searchLoading ? (
            <Loader />
          ) : data?.profiles.length === 0 ||
            (searchQuery.length > 0 && searchResults.length === 0) ? (
            <div className="noData">
              <p>Profile not found</p>
            </div>
          ) : (
            <div className="cards">
              <UserCard
                data={searchResults.length ? searchResults : data.profiles}
              />
            </div>
          )}
        </div>
      </section>
    </header>
  );
};

export default Appointment;
