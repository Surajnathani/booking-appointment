import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/appointment/`,
    credentials: "include",
  }),

  tagTypes: ["appointments"],

  endpoints: (builder) => ({
    bookAppointment: builder.mutation({
      query: ({ formData, proUserId }) => ({
        url: `${proUserId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Appointment"],
    }),

    getCurrentAppointment: builder.query({
      query: () => ({
        url: "getCurrentAppointment",
        method: "GET",
      }),
      providesTags: ["appointment"],
    }),

    getPreviousAppointment: builder.query({
      query: () => ({
        url: "getPreviousAppointment",
        method: "GET",
      }),
      providesTags: ["appointment"],
    }),

    updateAppointment: builder.mutation({
      query: ({ formData, appointmentId }) => ({
        url: `${appointmentId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["appointment"],
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useGetCurrentAppointmentQuery,
  useGetPreviousAppointmentQuery,
  useUpdateAppointmentMutation,
} = appointmentApi;
