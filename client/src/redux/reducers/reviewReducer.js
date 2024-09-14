import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myReviews: [],
  isLoading: true,
};

export const reviewReducer = createSlice({
  name: "reviewReducer",
  initialState,
  reducers: {
    setMyReviews: (state, action) => {
      state.myReviews = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setMyReviews } = reviewReducer.actions;
