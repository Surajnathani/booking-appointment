import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAppointment: [],
  previousAppointment: [],
  isLoading: true,
};

export const appointmentReducer = createSlice({
  name: "appointmentReducer",
  initialState,
  reducers: {
    currentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
      state.isLoading = false;
    },
    previousAppointment: (state, action) => {
      state.previousAppointment = action.payload;
      state.isLoading = false;
    },
  },
});

export const { currentAppointment, previousAppointment } =
  appointmentReducer.actions;
