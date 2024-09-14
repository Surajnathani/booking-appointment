/* eslint-disable react/prop-types */
import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaPlus } from "react-icons/fa";
import BookAppointment from "../../components/dialog/BookAppointment";
import { useSelector } from "react-redux";
import {
  useGetCurrentAppointmentQuery,
  useGetPreviousAppointmentQuery,
} from "../../redux/api/AppointmentApi";
import Loader from "../../components/loader/Loader";
import UpdateBookAppointment from "../../components/dialog/updateAppointment";
import toast from "react-hot-toast";

const localizer = momentLocalizer(moment);

const transformEvents = (data) => {
  return data.map((event) => {
    const start = moment(
      `${event.date} ${event.time}`,
      "YYYY-MM-DD h:mm A"
    ).toDate();
    const end = moment(start).add(1, "hour").toDate();
    return {
      _id: event._id,
      service: event.service,
      start,
      end,
      desc: {
        name: event.senderId.name,
        avatar: event.senderId.avatar,
        email: event.senderId.email,
        phone: event.senderId.phone,
        status: event.status,
      },
    };
  });
};

const CustomWeekHeader = ({ date }) => {
  return <div className="rbc-header">{moment(date).format("ddd")}</div>;
};

const DashboardCalender = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.WEEK);
  const [showDialog, setShowDialog] = useState(false);

  const { user: data, isLoading } = useSelector((state) => state.userReducer);

  const {
    data: currentAppointments = { appointments: [] },
    isLoading: currentAppointmentsLoading,
  } = useGetCurrentAppointmentQuery();

  const {
    data: previousAppointments = { appointments: [] },
    isLoading: previousAppointmentsLoading,
  } = useGetPreviousAppointmentQuery();

  const event = transformEvents([
    ...currentAppointments.appointments,
    ...previousAppointments.appointments,
  ]);

  const handleSelectEvent = (event) => {
    const now = moment();
    if (moment(event.start).isBefore(now)) {
      toast.error("Past events cannot be updated.");
      return;
    }
    setSelectedEvent(event);
    setShowDialog(true);
  };

  const handleCreateNewEvent = () => {
    setSelectedEvent({
      start: moment().toDate(),
      end: moment().toDate(),
      service: "",
    });
    setShowDialog(true);
  };

  const handleOnChangeView = (selectedView) => {
    setView(selectedView);
  };

  if (isLoading || currentAppointmentsLoading || previousAppointmentsLoading) {
    return <Loader />;
  }

  return (
    <div className="dashboardCalenderContainer">
      <div className="dashboardCalenderHeader">
        <h4>Calender</h4>
        <div className="createIcon" onClick={handleCreateNewEvent}>
          <BookAppointment profileData={data} Icon={FaPlus} />
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={event}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="service"
        style={{ height: "98%" }}
        view={view}
        views={["week", "day", "agenda"]}
        onView={handleOnChangeView}
        onSelectEvent={handleSelectEvent}
        components={{
          week: { header: CustomWeekHeader },
        }}
        min={new Date(0, 0, 0, data.startTime.substr(0, 2), 0, 0)}
        max={new Date(0, 0, 0, data.endTime.substr(0, 2), 0, 0)}
      />
      {showDialog && (
        <UpdateBookAppointment
          onClose={() => setShowDialog(false)}
          appointment={selectedEvent}
        />
      )}
    </div>
  );
};

export default DashboardCalender;
