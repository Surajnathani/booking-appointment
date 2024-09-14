import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffMember: null,
  isLoading: true,
};

export const staffReducer = createSlice({
  name: "staffReducer",
  initialState,
  reducers: {
    addStaffMember: (state, action) => {
      state.staffMember = action.payload;
      state.isLoading = false;
    },
    removeStaffMember: (state, action) => {
      state.isLoading = true;
      state.staffMember = state.staffMember.filter(
        (i) => i._id !== action.payload
      );
      state.isLoading = false;
    },
    updateStaffMember: (state, action) => {
      state.isLoading = true;
      state.staffMember = state.staffMember.map((staff) =>
        staff._id === action.payload._id
          ? { ...staff, ...action.payload }
          : staff
      );
      state.isLoading = false;
    },
  },
});

export const { addStaffMember, removeStaffMember, updateStaffMember } =
  staffReducer.actions;
