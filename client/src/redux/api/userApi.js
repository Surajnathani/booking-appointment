import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/user/`,
    credentials: "include",
  }),
  tagTypes: ["users"],

  endpoints: (builder) => ({
    userSignup: builder.mutation({
      query: (user) => ({
        url: "signup",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    userSignIn: builder.mutation({
      query: (user) => ({
        url: "signin",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    fetchUserProfile: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      providesTags: ["users"],
    }),

    updateUserProfile: builder.mutation({
      query: (updateUser) => ({
        url: "updateUser",
        method: "PUT",
        body: updateUser,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation({
      query: () => ({
        url: `deleteUser`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    userLogout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useUserSignupMutation,
  useUserSignInMutation,
  useFetchUserProfileQuery,
  useUpdateUserProfileMutation,
  useUserLogoutMutation,
} = userApi;
