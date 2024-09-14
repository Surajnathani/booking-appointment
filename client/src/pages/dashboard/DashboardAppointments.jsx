import { useDispatch } from "react-redux";
import Loader from "../../components/loader/Loader";
import { AppointmentTable } from "../../components/table/Table";
import {
  useGetCurrentAppointmentQuery,
  useGetPreviousAppointmentQuery,
} from "../../redux/api/AppointmentApi";
import {
  currentAppointment,
  previousAppointment,
} from "../../redux/reducers/appointmentReducer";
import { useEffect } from "react";

const DashboardAppointments = () => {
  const dispatch = useDispatch();

  const {
    data: currentAppointments,
    isLoading: currentAppointmentsLoading,
    refetch: refetchCurrentAppointments,
  } = useGetCurrentAppointmentQuery();
  const {
    data: previousAppointments,
    isLoading: previousAppointmentsLoading,
    refetch: refetchPreviousAppointments,
  } = useGetPreviousAppointmentQuery();

  useEffect(() => {
    if (currentAppointments) {
      dispatch(currentAppointment(currentAppointments.appointments));
    }
    if (previousAppointments) {
      dispatch(previousAppointment(previousAppointments.appointments));
    }
  }, [dispatch, currentAppointments, previousAppointments]);

  useEffect(() => {
    refetchCurrentAppointments();
    refetchPreviousAppointments();
  }, [refetchCurrentAppointments, refetchPreviousAppointments]);

  if (currentAppointmentsLoading || previousAppointmentsLoading) {
    return <Loader />;
  }
  return (
    <div className="dashboardContainer">
      {currentAppointments.appointments.length === 0 &&
      previousAppointments.appointments.length === 0 ? (
        <div className="noData" style={{ height: "80vh" }}>
          <p style={{ fontSize: "30px" }}>No appointment found</p>
        </div>
      ) : (
        currentAppointments.appointments.length !== 0 &&
        !currentAppointmentsLoading && (
          <div className="appointmentsTable">
            <h4>
              Ongoing Appointments ({currentAppointments.appointments.length})
            </h4>
            <AppointmentTable appointments={currentAppointments.appointments} />
          </div>
        )
      )}
      {previousAppointments.appointments.length !== 0 &&
        !previousAppointmentsLoading && (
          <div className="appointmentsTable">
            <h4>Completed Appointments</h4>
            <AppointmentTable
              appointments={previousAppointments.appointments}
            />
          </div>
        )}
    </div>
  );
};

export default DashboardAppointments;
