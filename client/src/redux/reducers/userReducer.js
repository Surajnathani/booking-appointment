import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: true,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    userNotExist: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

export const { userExists, userNotExist } = userReducer.actions;
