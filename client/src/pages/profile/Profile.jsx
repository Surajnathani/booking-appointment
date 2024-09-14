import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppointmentCard from "../../components/appointmentCard/AppointmentCard";
import Loader from "../../components/loader/Loader";
import ProfileCard from "../../components/profileCard.jsx/ProfileCard";
import {
  useGetCurrentAppointmentQuery,
  useGetPreviousAppointmentQuery,
} from "../../redux/api/AppointmentApi";
import {
  currentAppointment,
  previousAppointment,
} from "../../redux/reducers/appointmentReducer";
import "./profile.css";

const Profile = () => {
  const dispatch = useDispatch();

  const { data: currentAppointments, isLoading: currentAppointmentsLoading } =
    useGetCurrentAppointmentQuery();

  const { data: previousAppointments, isLoading: previousAppointmentsLoading } =
    useGetPreviousAppointmentQuery();

  useEffect(() => {
    if (currentAppointments) {
      dispatch(currentAppointment(currentAppointments.appointments));
    }
    if (previousAppointments) {
      dispatch(previousAppointment(previousAppointments.appointments));
    }
  }, [dispatch, currentAppointments, previousAppointments]);

  if (currentAppointmentsLoading || previousAppointmentsLoading) {
    return <Loader />;
  }

  return (
    <header className="mainProfileContainer">
      <ProfileCard />
      {currentAppointments.appointments.length !== 0 &&
        !currentAppointmentsLoading && (
          <section className="profileContainer">
            <h4>Current Running Appointments</h4>
            <AppointmentCard appointments={currentAppointments.appointments} />
          </section>
        )}
      {previousAppointments.appointments.length !== 0 &&
        !previousAppointmentsLoading && (
          <section className="profileContainer">
            <h4>Previous Appointments</h4>
            <AppointmentCard appointments={previousAppointments.appointments} />
          </section>
        )}
    </header>
  );
};

export default Profile;
