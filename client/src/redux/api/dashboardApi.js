import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/dashboard`,
    credentials: "include",
  }),
  tagTypes: ["dashboard"],
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => ({
        url: "/stats",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
