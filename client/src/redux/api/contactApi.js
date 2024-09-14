import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/support/`,
    credentials: "include",
  }),
  tagTypes: ["contacts"],

  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (message) => ({
        url: "contact",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["contacts"],
    }),
  }),
});

export const { useSendMessageMutation } = contactApi;
