import { configureStore } from "@reduxjs/toolkit";
import { appointmentApi } from "./api/AppointmentApi";
import { contactApi } from "./api/contactApi";
import { dashboardApi } from "./api/dashboardApi";
import { proUserApi } from "./api/proUserApi";
import { reviewApi } from "./api/reviewApi";
import { staffApi } from "./api/staffApi";
import { userApi } from "./api/userApi";
import { appointmentProfileReducer } from "./reducers/appointmentProfileReducer";
import { reviewReducer } from "./reducers/reviewReducer";
import { staffReducer } from "./reducers/staffReducer";
import { userReducer } from "./reducers/userReducer";
import { appointmentReducer } from "./reducers/appointmentReducer";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [proUserApi.reducerPath]: proUserApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [staffApi.reducerPath]: staffApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [staffReducer.name]: staffReducer.reducer,
    [appointmentProfileReducer.name]: appointmentProfileReducer.reducer,
    [appointmentReducer.name]: appointmentReducer.reducer,
    [reviewReducer.name]: reviewReducer.reducer,
  },
  middleware: (mid) => [
    ...mid(),
    userApi.middleware,
    proUserApi.middleware,
    contactApi.middleware,
    staffApi.middleware,
    reviewApi.middleware,
    dashboardApi.middleware,
    appointmentApi.middleware,
  ],
});

export default store;
