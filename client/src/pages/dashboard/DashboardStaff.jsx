import { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import AddStaff from "../../components/dialog/AddStaff";
import Loader from "../../components/loader/Loader";
import { StaffTable } from "../../components/table/Table";
import {
  useGetStaffMemberQuery,
  useSearchStaffMemberMutation,
} from "../../redux/api/staffApi";
import { addStaffMember } from "../../redux/reducers/staffReducer";

const DashboardStaff = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  const {
    data,
    refetch: refetchStaff,
    isLoading: dataLoading,
  } = useGetStaffMemberQuery();

  const [searchStaff, { isLoading: searchLoading }] =
    useSearchStaffMemberMutation();

  useEffect(() => {
    if (data) {
      dispatch(addStaffMember(data.staff));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchStaff({ query: searchQuery })
          .then(({ data }) => setSearchResults(data.staffMember || []))
          .catch((error) => console.error(error));
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [searchQuery, searchStaff]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    refetchStaff();
  }, [refetchStaff]);

  if (dataLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboardContainer">
      <div className="appointmentsTable">
        <h4>Staff Members</h4>
        <div className="staffMembers">
          <span>
            <h4>{data.staff?.length || 0}</h4>
            <p>Members</p>
          </span>
          <div className="searchContainer">
            <div className="staffSearchBox">
              <input
                type="text"
                placeholder="Find member..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery ? (
                <IoClose className="searchIcon" onClick={handleResetSearch} />
              ) : (
                <IoIosSearch className="searchIcon" />
              )}
            </div>
            <AddStaff />
          </div>
        </div>
        {dataLoading || searchLoading ? (
          <Loader />
        ) : data.staff == null ||
          data.staff?.length === 0 ||
          (searchQuery?.length > 0 && searchResults?.length == 0) ? (
          <div className="noData" style={{ height: "80vh" }}>
            <p style={{ fontSize: "30px" }}>No staff members found</p>
          </div>
        ) : (
          <StaffTable
            staffMembers={searchResults.length ? searchResults : data.staff}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardStaff;
