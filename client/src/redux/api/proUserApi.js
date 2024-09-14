import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const proUserApi = createApi({
  reducerPath: "proUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/pro-user/`,
    credentials: "include",
  }),
  tagTypes: ["pro-users", "pro-users-profile"],

  endpoints: (builder) => ({
    proUserSignup: builder.mutation({
      query: (proUser) => ({
        url: "signup",
        method: "POST",
        body: proUser,
      }),
      invalidatesTags: ["pro-users"],
    }),

    fetchProUserProfile: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      providesTags: ["pro-users"],
    }),

    fetchProUserProfiles: builder.query({
      query: ({ category, rating }) => {
        const queryParams = new URLSearchParams({
          ...(category && { category }),
          ...(rating && { rating }),
        }).toString();

        return {
          url: `getAll?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["pro-users-profile"],
    }),

    fetchSingleProUserProfile: builder.query({
      query: (id) => ({
        url: `getSingle/${id}`,
        method: "GET",
      }),
      providesTags: ["pro-user-profile"],
    }),

    searchProUser: builder.mutation({
      query: (searchParams) => ({
        url: `searchProfile?centerName=${searchParams.query}`,
        method: "GET",
      }),
      invalidatesTags: ["pro-users-profile"],
    }),

    updateProUserProfile: builder.mutation({
      query: (updateUser) => ({
        url: "updateProUser",
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: ["pro-users"],
    }),

    deleteProUser: builder.mutation({
      query: () => ({
        url: `deleteProUser`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    proUserLogout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      invalidatesTags: ["pro-users"],
    }),
  }),
});

export const {
  useProUserSignupMutation,
  useFetchProUserProfileQuery,
  useFetchProUserProfilesQuery,
  useFetchSingleProUserProfileQuery,
  useSearchProUserMutation,
  useUpdateProUserProfileMutation,
  useDeleteProUserMutation,
  useProUserLogoutMutation,
} = proUserApi;
