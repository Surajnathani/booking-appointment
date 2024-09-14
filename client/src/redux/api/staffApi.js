import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const staffApi = createApi({
  reducerPath: "staffApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/staff/`,
    credentials: "include",
  }),
  tagTypes: ["staff"],

  endpoints: (builder) => ({
    newStaffMember: builder.mutation({
      query: (user) => ({
        url: "newStaff",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["staff"],
    }),

    getStaffMember: builder.query({
      query: () => ({
        url: "getStaff",
        method: "GET",
      }),
      providesTags: ["staff"],
    }),

    searchStaffMember: builder.mutation({
      query: (searchParams) => ({
        url: `searchStaff?username=${encodeURIComponent(searchParams.query)}`,
        method: "GET",
      }),
      invalidatesTags: ["staff"],
    }),

    updateStaffMember: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `updateStaff/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["staff"],
    }),

    deleteStaffMember: builder.mutation({
      query: (id) => ({
        url: `deleteStaff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["staff"],
    }),
  }),
});

export const {
  useNewStaffMemberMutation,
  useGetStaffMemberQuery,
  useSearchStaffMemberMutation,
  useUpdateStaffMemberMutation,
  useDeleteStaffMemberMutation,
} = staffApi;
