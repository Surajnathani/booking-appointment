import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/review/`,
    credentials: "include",
  }),
  tagTypes: ["reviews"],

  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: ({ review, proUserId }) => ({
        url: `postReview/${proUserId}`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["reviews"],
    }),
    getReviews: builder.query({
      query: (userId) => ({
        url: `getReview/${userId}`,
        method: "GET",
      }),
      providesTags: ["reviews"],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `deleteReview/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
} = reviewApi;
