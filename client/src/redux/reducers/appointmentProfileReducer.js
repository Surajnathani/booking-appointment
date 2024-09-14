import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointmentProfile: null,
  isLoading: true,
};

export const appointmentProfileReducer = createSlice({
  name: "appointmentProfileReducer",
  initialState,
  reducers: {
    appointmentProfile: (state, action) => {
      state.appointmentProfile = action.payload;
      state.isLoading = false;
    },
  },
});

export const { appointmentProfile } = appointmentProfileReducer.actions;
